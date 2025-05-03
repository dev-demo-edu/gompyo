import { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import StarIcon from "@mui/icons-material/Star";
import Box from "@mui/material/Box";
import LinkCard, { LinkCardType, SortableLinkCard } from "./link-card";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

interface LinkListProps {
  links: LinkCardType[];
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  draggable?: boolean;
  setLinks?: (links: LinkCardType[]) => void;
}

const LinkList = ({
  links,
  onToggleFavorite,
  onDelete,
  draggable = false,
  setLinks,
}: LinkListProps) => {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // DnD 관련 Hook은 항상 호출
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );
  const handleDragEnd = (event: DragEndEvent) => {
    if (!setLinks) return;
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = links.findIndex((l) => l.id === active.id);
      const newIndex = links.findIndex((l) => l.id === over?.id);
      const newLinks = arrayMove(links, oldIndex, newIndex).map(
        (link, idx) => ({ ...link, order: idx + 1 }),
      );
      setLinks(newLinks);
    }
  };

  // Filter links based on favorites toggle
  const filteredLinks = showFavoritesOnly
    ? links.filter((link) => link.isFavorite)
    : links;

  // Sort links based on selection
  const sortedLinks = [...filteredLinks].sort((a, b) => {
    return a.title.localeCompare(b.title);
  });

  // 필터/정렬 UI는 항상 렌더링
  const filterSortUI = (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      spacing={2}
      mb={3}
    >
      <Typography variant="h5" fontWeight={700}>
        내 링크
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant={showFavoritesOnly ? "contained" : "outlined"}
          color={showFavoritesOnly ? "primary" : "primary"}
          startIcon={
            <StarIcon
              sx={{ color: showFavoritesOnly ? "#facc15" : undefined }}
            />
          }
          onClick={() => setShowFavoritesOnly((v) => !v)}
          sx={{
            minWidth: 120,
            minHeight: 44,
            fontWeight: 600,
            fontSize: 16,
            lineHeight: 1.5,
            py: 0,
            boxShadow: "none",
          }}
        >
          즐겨찾기{showFavoritesOnly ? " 보기 해제" : "만 보기"}
        </Button>
      </Stack>
    </Stack>
  );

  // DnD 모드
  if (draggable) {
    return (
      <Box bgcolor="background.paper" p={2} borderRadius={2}>
        {filterSortUI}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={links.map((l) => l.id)}
            strategy={rectSortingStrategy}
          >
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              }}
            >
              {links.map((link) => (
                <div key={link.id}>
                  <SortableLinkCard
                    link={link}
                    onToggleFavorite={onToggleFavorite}
                    onDelete={onDelete}
                  />
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </Box>
    );
  }

  // 일반 리스트
  return (
    <Box bgcolor="background.paper" p={2} borderRadius={2}>
      {filterSortUI}
      {sortedLinks.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            border: 1,
            borderColor: "grey.200",
            borderRadius: 2,
            borderStyle: "dashed",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            {showFavoritesOnly
              ? "즐겨찾기된 링크가 없습니다."
              : "저장된 링크가 없습니다. 새 링크를 추가해보세요!"}
          </Typography>
        </Box>
      ) : (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          }}
        >
          {sortedLinks.map((link) => (
            <div key={link.id}>
              <LinkCard link={link} onToggleFavorite={onToggleFavorite} />
            </div>
          ))}
        </div>
      )}
    </Box>
  );
};

export default LinkList;
