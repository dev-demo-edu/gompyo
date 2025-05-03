"use client";

import { useState, useEffect } from "react";
import LinkAddModal from "./links-modal";
import { getLinks, deleteLink } from "@/actions/info/link-actions";
import { LinkCardType } from "@/components/link-card";
import LinkList from "@/components/link-list";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

const mockLinks: LinkCardType[] = [
  {
    id: "1",
    title: "구글",
    url: "https://www.google.com",
    order: 1,
    createdAt: "2024-06-01T10:00:00.000Z",
    updatedAt: "2024-06-01T10:00:00.000Z",
    isFavorite: true,
    thumbnailUrl:
      "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
  },
  {
    id: "2",
    title: "네이버",
    url: "https://www.naver.com",
    order: 2,
    createdAt: "2024-06-01T10:01:00.000Z",
    updatedAt: "2024-06-01T10:01:00.000Z",
    isFavorite: false,
    thumbnailUrl:
      "https://s.pstatic.net/static/www/mobile/edit/20230517_1095/upload_1684304309282rTg0A.png",
  },
  {
    id: "3",
    title: "깃허브",
    url: "https://github.com",
    order: 3,
    createdAt: "2024-06-01T10:02:00.000Z",
    updatedAt: "2024-06-01T10:02:00.000Z",
    isFavorite: true,
    thumbnailUrl:
      "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
  },
  {
    id: "4",
    title: "유튜브",
    url: "https://www.youtube.com",
    order: 4,
    createdAt: "2024-06-01T10:03:00.000Z",
    updatedAt: "2024-06-01T10:03:00.000Z",
    isFavorite: false,
    thumbnailUrl:
      "https://www.youtube.com/s/desktop/6e8e7e1d/img/favicon_144x144.png",
  },
  {
    id: "5",
    title: "유튜브",
    url: "https://www.youtube.com",
    order: 4,
    createdAt: "2024-06-01T10:03:00.000Z",
    updatedAt: "2024-06-01T10:03:00.000Z",
    isFavorite: false,
    thumbnailUrl:
      "https://www.youtube.com/s/desktop/6e8e7e1d/img/favicon_144x144.png",
  },
];

export default function Links() {
  const [openLinkAddModal, setOpenLinkAddModal] = useState(false);
  const [links, setLinks] = useState<LinkCardType[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // 링크 목록 불러오기
  const fetchLinks = async () => {
    setLoading(true);
    const data = await getLinks();
    setLinks(data);
    setLoading(false);
  };

  useEffect(() => {
    // 실제 데이터 연동 시 fetchLinks() 사용
    fetchLinks();
    setLinks(mockLinks);
  }, []);

  // 즐겨찾기 토글
  const handleToggleFavorite = (id: string) => {
    setLinks((prev) =>
      prev.map((link) =>
        link.id === id ? { ...link, isFavorite: !link.isFavorite } : link,
      ),
    );
  };

  // 삭제
  const handleDelete = async (id: string) => {
    setLinks((prev) => prev.filter((link) => link.id !== id));
    await deleteLink(id);
  };

  return loading ? (
    <CircularProgress />
  ) : (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="p-4 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          링크 관리
        </h1>
        <Stack
          direction="row"
          spacing={2}
          className="w-full justify-end mb-4 sm:mb-6"
        >
          {/* TODO: 버튼 스타일 통일하기 */}
          <Button
            variant="contained"
            color="primary"
            sx={{
              minWidth: 120,
              minHeight: 44,
              fontWeight: 600,
              fontSize: 16,
              lineHeight: 1.5,
              py: 0,
              backgroundColor: "#22C55E",
              "&:hover": { backgroundColor: "#16A34A" },
              boxShadow: "none",
            }}
            onClick={() => setOpenLinkAddModal(true)}
          >
            링크 추가
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              minWidth: 120,
              minHeight: 44,
              fontWeight: 600,
              fontSize: 16,
              lineHeight: 1.5,
              py: 0,
              backgroundColor: editMode ? "#f3f4f6" : "#64748b",
              color: editMode ? "#374151" : "#fff",
              "&:hover": { backgroundColor: editMode ? "#e5e7eb" : "#475569" },
              boxShadow: "none",
              border: editMode ? "1px solid #cbd5e1" : "none",
            }}
            onClick={() => setEditMode((v) => !v)}
          >
            {editMode ? "편집 종료" : "편집 모드"}
          </Button>
        </Stack>
        {/* 편집 모드일 때만 dnd-kit, 아닐 때는 일반 리스트 */}
        {editMode ? (
          <LinkList
            links={links}
            setLinks={setLinks}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
            draggable={editMode}
          />
        ) : (
          <LinkList
            links={links}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
          />
        )}
      </div>
      <LinkAddModal
        open={openLinkAddModal}
        onClose={() => setOpenLinkAddModal(false)}
      />
    </div>
  );
}
