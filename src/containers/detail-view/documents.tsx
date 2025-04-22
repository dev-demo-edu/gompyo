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
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { useState, useEffect, useCallback } from "react";
import {
  getDocuments,
  uploadDocuments,
  getSignedDownloadUrl,
  deleteDocument,
} from "@/actions/document-actions";
import { useToast } from "@/hooks/use-toast";
import { useAtom, useAtomValue } from "jotai";
import {
  getDocumentsAtom,
  getCurrentDocuments,
  getIsLoading,
  Document,
} from "@/states/document-state";
import { CircularProgress } from "@mui/material";
import { cargoDetailAtom } from "@/states/detail";
interface DocumentsProps {
  cargoId: string;
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

export default function Documents({ cargoId }: DocumentsProps) {
  const [activeTab, setActiveTab] = useState<"contract" | "shipment">(
    "contract",
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null,
  );
  const { toast } = useToast();

  const [, setDocuments] = useAtom(getDocumentsAtom);
  const getCurrentDocs = useAtomValue(getCurrentDocuments);
  const getLoadingState = useAtomValue(getIsLoading);
  // const shouldFetch = useAtomValue(shouldFetchDocuments);
  const [mappedData] = useAtom(cargoDetailAtom);
  const [contractId, setContractId] = useState<string>("");
  const [shipmentId, setShipmentId] = useState<string>("");

  useEffect(() => {
    if (!mappedData) return;

    setContractId(mappedData.contract?.id || "");
    setShipmentId(mappedData.shipment?.id || "");

    if (!contractId && !shipmentId) {
      toast({
        title: "오류",
        description: "관련 문서를 찾을 수 없습니다.",
        variant: "destructive",
      });
      return;
    }

    fetchDocuments();
  }, [mappedData]);

  const currentDocuments = getCurrentDocs(
    activeTab === "contract" ? contractId : shipmentId,
    activeTab,
  );
  const isLoading = getLoadingState(
    activeTab === "contract" ? contractId : shipmentId,
    activeTab,
  );

  useEffect(() => {
    fetchDocuments();
  }, [cargoId]);

  const fetchDocuments = async () => {
    const categories: ("contract" | "shipment")[] = ["contract", "shipment"];
    for (const category of categories) {
      const relatedId =
        category === "contract"
          ? mappedData?.contract?.id
          : mappedData?.shipment?.id;
      if (!relatedId) {
        toast({
          title: "오류",
          description: "관련 문서를 찾을 수 없습니다.",
          variant: "destructive",
        });
        return;
      }
      try {
        setDocuments({
          relatedId,
          category,
          documents: [],
          isLoading: true,
        });

        const result = await getDocuments(relatedId, category);
        if (result.success && result.documents) {
          setDocuments({
            relatedId,
            category,
            documents: result.documents as Document[],
            isLoading: false,
          });
        } else {
          console.error(`${category} 문서 목록 조회 실패:`, result.error);
          toast({
            title: "오류",
            description: result.error || "문서 목록을 불러오는데 실패했습니다.",
            variant: "destructive",
          });
          setDocuments({
            relatedId,
            category,
            documents: [],
            isLoading: false,
          });
        }
      } catch (error) {
        console.error(`${category} 문서 목록 조회 중 오류 발생:`, error);
        toast({
          title: "오류",
          description: "문서 목록을 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
        setDocuments({
          relatedId,
          category,
          documents: [],
          isLoading: false,
        });
      }
    }
  };

  const handleUpload = async (
    files: File[],
    category: "contract" | "shipment",
  ) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const relatedId =
        category === "contract"
          ? mappedData?.contract?.id
          : mappedData?.shipment?.id;
      if (!relatedId) {
        toast({
          title: "오류",
          description: "관련 문서를 찾을 수 없습니다.",
          variant: "destructive",
        });
        return;
      }

      const result = await uploadDocuments(formData, relatedId, category);
      if (result.success) {
        await fetchDocuments();
      } else {
        console.error("파일 업로드 실패:", result.error);
        toast({
          title: "오류",
          description: result.error || "파일 업로드에 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("파일 업로드 중 오류 발생:", error);
      toast({
        title: "오류",
        description: "파일 업로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (document: Document) => {
    try {
      const result = await getSignedDownloadUrl(document.id);
      if (result.success) {
        window.open(result.url, "_blank");
      } else {
        toast({
          title: "오류",
          description: result.error || "파일 다운로드에 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("파일 다운로드 중 오류 발생:", error);
      toast({
        title: "오류",
        description: "파일 다운로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (document: Document) => {
    setDocumentToDelete(document);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;

    try {
      const result = await deleteDocument(documentToDelete.id, cargoId);
      if (result.success) {
        await fetchDocuments();
        toast({
          title: "성공",
          description: "문서가 삭제되었습니다.",
        });
      } else {
        toast({
          title: "오류",
          description: result.error || "문서 삭제에 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("문서 삭제 중 오류 발생:", error);
      toast({
        title: "오류",
        description: "문서 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  const filteredDocuments = currentDocuments.filter(
    (doc) => doc.documentCategory === activeTab,
  );

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center h-full">
        <CircularProgress />
      </Box>
    );
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
                        onClick={() => handleDelete(document)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  }
                >
                  <ListItemText
                    primary={document.documentName}
                    secondary={new Date(
                      document.uploadDate,
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

      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">문서 삭제 확인</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {documentToDelete?.documentName} 문서를 삭제하시겠습니까? 이 작업은
            되돌릴 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>취소</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
