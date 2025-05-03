import { useState, useEffect } from "react";
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
import CircularProgress from "@mui/material/CircularProgress";
import {
  getLinks,
  deleteLink,
  reorderLinks,
} from "@/actions/info/link-actions";
import { useAtomValue } from "jotai";
import { linkRefreshAtom } from "@/states/link";

interface LinkListProps {
  editMode?: boolean;
}

const LinkList = ({ editMode = false }: LinkListProps) => {
  const [links, setLinks] = useState<LinkCardType[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const refresh = useAtomValue(linkRefreshAtom);

  // fetchLinks 내부 관리
  const fetchLinks = async () => {
    setLoading(true);
    const data = await getLinks();
    setLinks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLinks();
  }, [refresh]);

  // 즐겨찾기 토글
  const handleToggleFavorite = (id: string) => {
    setLinks(
      (prev) =>
        prev?.map((link) =>
          link.id === id ? { ...link, isFavorite: !link.isFavorite } : link,
        ) || [],
    );
  };

  // 삭제
  const handleDelete = async (id: string) => {
    setLinks((prev) => prev?.filter((link) => link.id !== id) || []);
    await deleteLink(id);
  };

  // DnD 관련 Hook은 항상 호출
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      // sortedLinks 기준으로 인덱스 계산
      const oldIndex = sortedLinks.findIndex((l) => l.id === active.id);
      const newIndex = sortedLinks.findIndex((l) => l.id === over?.id);
      const movedSorted = arrayMove(sortedLinks, oldIndex, newIndex);
      // links 배열을 movedSorted 순서대로 재정렬 (order 부여)
      const newLinks = movedSorted.map((link, idx) => ({
        ...link,
        order: idx + 1,
      }));
      setLinks(newLinks);
      // 서버에 순서 반영
      await reorderLinks(newLinks.map(({ id, order }) => ({ id, order })));
    }
  };

  // Filter links based on favorites toggle
  const filteredLinks = showFavoritesOnly
    ? links?.filter((link) => link.isFavorite) || []
    : links || [];

  // Sort links based on selection
  const sortedLinks = filteredLinks;

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
  if (editMode) {
    return (
      <Box bgcolor="background.paper" p={2} borderRadius={2}>
        {filterSortUI}
        {loading ? (
          <Box className="w-full h-full flex items-center justify-center">
            <CircularProgress />
          </Box>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedLinks.map((l) => l.id)}
              strategy={rectSortingStrategy}
            >
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                }}
              >
                {sortedLinks.map((link) => (
                  <div key={link.id}>
                    <SortableLinkCard
                      link={link}
                      onToggleFavorite={handleToggleFavorite}
                      onDelete={handleDelete}
                    />
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </Box>
    );
  }

  // 일반 리스트
  if (links === null || loading) {
    return (
      <Box bgcolor="background.paper" p={2} borderRadius={2}>
        {filterSortUI}
        <Box className="w-full h-full flex items-center justify-center">
          <CircularProgress />
        </Box>
      </Box>
    );
  }

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
              <LinkCard link={link} onToggleFavorite={handleToggleFavorite} />
            </div>
          ))}
        </div>
      )}
    </Box>
  );
};

export default LinkList;
