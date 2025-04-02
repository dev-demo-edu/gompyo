import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { useState, useEffect, useCallback } from "react";
import { CargoDetailData } from "@/types/cargo-detail";

interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  createdAt: string;
  category: "contract" | "shipment";
}

interface DocumentsProps {
  cargoId: string;
  cargoData: CargoDetailData | null;
}

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (files: File[], category: "contract" | "shipment") => void;
  category: "contract" | "shipment";
}

function UploadModal({ open, onClose, onUpload, category }: UploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles, category);
      onClose();
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setSelectedFiles([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {category === "contract" ? "계약단 서류 업로드" : "선적단 서류 업로드"}
      </DialogTitle>
      <DialogContent>
        <Box
          className={`mt-4 p-8 border-2 border-dashed rounded-lg text-center ${
            isDragging ? "border-primary bg-primary/5" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CloudUploadIcon className="text-4xl text-gray-400 mb-4" />
          <Typography variant="body1" sx={{ mb: 2 }}>
            파일을 드래그하여 업로드하거나
          </Typography>
          <Button variant="outlined" component="label">
            파일 선택
            <input type="file" multiple hidden onChange={handleFileSelect} />
          </Button>
        </Box>

        {selectedFiles.length > 0 && (
          <Box className="mt-4">
            <Typography variant="subtitle2" className="mb-2">
              선택된 파일 목록
            </Typography>
            <List className="max-h-48 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={file.name}
                    secondary={`${(file.size / 1024).toFixed(2)} KB`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={selectedFiles.length === 0}
        >
          업로드 ({selectedFiles.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Documents({ cargoId, cargoData }: DocumentsProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"contract" | "shipment">(
    "contract",
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [cargoId]);

  const fetchDocuments = async () => {
    try {
      console.log(cargoData); // For Lint
      // TODO: API 호출로 문서 목록 가져오기
      setIsLoading(false);
    } catch (error) {
      console.error("문서 목록 조회 중 오류 발생:", error);
      setIsLoading(false);
    }
  };

  const handleUpload = async (
    files: File[],
    category: "contract" | "shipment",
  ) => {
    try {
      // TODO: S3 업로드 API 호출
      console.log("파일 업로드:", files, "카테고리:", category);
    } catch (error) {
      console.error("파일 업로드 중 오류 발생:", error);
    }
  };

  const handleDownload = async (document: Document) => {
    try {
      // TODO: S3 다운로드 API 호출
      window.open(document.url, "_blank");
    } catch (error) {
      console.error("파일 다운로드 중 오류 발생:", error);
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      // TODO: S3 삭제 API 호출
      setDocuments(documents.filter((doc) => doc.id !== documentId));
    } catch (error) {
      console.error("파일 삭제 중 오류 발생:", error);
    }
  };

  const filteredDocuments = documents.filter(
    (doc) => doc.category === activeTab,
  );

  if (isLoading) {
    return <Typography>로딩 중...</Typography>;
  }

  return (
    <Box className="space-y-6">
      <Paper className="p-4">
        <Stack spacing={3}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" className="font-bold">
              서류 관리
            </Typography>
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={() => setIsUploadModalOpen(true)}
            >
              {activeTab === "contract"
                ? "계약단 서류 업로드"
                : "선적단 서류 업로드"}
            </Button>
          </Stack>

          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            className="border-b"
          >
            <Tab label="계약단 서류" value="contract" />
            <Tab label="선적단 서류" value="shipment" />
          </Tabs>

          <List>
            {filteredDocuments.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary={`등록된 ${activeTab === "contract" ? "계약단" : "선적단"} 서류가 없습니다.`}
                />
              </ListItem>
            ) : (
              filteredDocuments.map((document) => (
                <ListItem
                  key={document.id}
                  divider
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        edge="end"
                        aria-label="download"
                        onClick={() => handleDownload(document)}
                      >
                        <DownloadIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDelete(document.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  }
                >
                  <ListItemText
                    primary={document.name}
                    secondary={new Date(
                      document.createdAt,
                    ).toLocaleDateString()}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Stack>
      </Paper>

      <UploadModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
        category={activeTab}
      />
    </Box>
  );
}
