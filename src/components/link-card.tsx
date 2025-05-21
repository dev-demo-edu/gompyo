import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import LinkIcon from "@mui/icons-material/Link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface LinkCardType {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
  order?: number;
}

function ensureUrlProtocol(url: string) {
  if (!/^https?:\/\//i.test(url)) return `https://${url}`;
  return url;
}
function getUrlDomain(url: string) {
  try {
    return new URL(ensureUrlProtocol(url)).hostname;
  } catch {
    return url;
  }
}

interface LinkCardProps {
  link: LinkCardType;
  onToggleFavorite: (id: string) => void;
  onDelete?: (id: string) => void;
  disable?: boolean;
}

const LinkCard = ({
  link,
  onToggleFavorite,
  onDelete,
  disable,
}: LinkCardProps) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => setImageError(true);
  const handleLinkClick = () => {
    if (disable) return;
    window.open(ensureUrlProtocol(link.url), "_blank", "noopener,noreferrer");
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "relative",
          aspectRatio: "16/9",
          cursor: "pointer",
          overflow: "hidden",
        }}
        onClick={handleLinkClick}
      >
        <CardMedia
          component="img"
          height="140"
          draggable={false}
          onErrorCapture={() => {
            setImageError(true);
          }}
          image={imageError ? "/gompyo.svg" : link.thumbnail || "/gompyo.svg"}
          alt={link.title}
          sx={{
            width: "100%",
            height: 180,
            objectFit: "contain",
            transition: "transform 0.2s",
            "&:hover": { transform: "scale(1.05)" },
          }}
          onError={handleImageError}
        />
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            display: "flex",
            gap: 1,
          }}
        >
          <Tooltip title={link.isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}>
            <IconButton
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(2px)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(link.id);
              }}
            >
              {link.isFavorite ? (
                <StarIcon sx={{ color: "#facc15" }} />
              ) : (
                <StarBorderIcon sx={{ color: "#9ca3af" }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 2 }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Tooltip title={link.title}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                mb: 0.5,
                cursor: "pointer",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
              onClick={handleLinkClick}
            >
              {link.title}
            </Typography>
          </Tooltip>
          <Typography variant="body2" color="text.secondary" noWrap>
            {getUrlDomain(link.url)}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Button
            variant="outlined"
            size="small"
            startIcon={<LinkIcon fontSize="small" />}
            onClick={handleLinkClick}
            sx={{ fontSize: 13 }}
            disabled={disable}
          >
            방문하기
          </Button>
          {onDelete && (
            <Tooltip title="삭제">
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(link.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default LinkCard;

export function SortableLinkCard({
  link,
  onToggleFavorite,
  onDelete,
}: {
  link: LinkCardType;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.7 : 1,
      }}
      {...attributes}
      {...listeners}
    >
      <LinkCard
        link={link}
        onToggleFavorite={onToggleFavorite}
        onDelete={onDelete}
        disable={true}
      />
    </div>
  );
}
