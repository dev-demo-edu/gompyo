import {
  Box,
  Container,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Button,
  Stack,
} from "@mui/material";
import { Search, Notifications, Settings, Help } from "@mui/icons-material";
import DetailForm from "@/components/detail-form";

export default async function DetailPage({
  params,
}: {
  params: { cargo_id: string };
}) {
  const { cargo_id } = await params;
  console.log(cargo_id);
  return (
    <div className="min-h-screen bg-background-paper">
      {/* 헤더 */}
      <Box className="w-full h-16 px-10 bg-background-default flex justify-between items-center">
        <Typography
          variant="h4"
          className="text-success-darker font-bold font-['Public_Sans']"
        >
          상세보기
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box className="h-9 pr-2 bg-grey-8% bg-opacity-10 rounded-[10px] flex items-center">
            <IconButton size="small">
              <Search />
            </IconButton>
            <Box className="h-6 px-1.5 bg-background-paper rounded-md shadow-sm">
              <Typography variant="caption" className="text-text-primary">
                ⌘K
              </Typography>
            </Box>
          </Box>
          <Badge badgeContent={1} color="error">
            <IconButton>
              <Notifications />
            </IconButton>
          </Badge>
          <IconButton>
            <Settings />
          </IconButton>
          <IconButton>
            <Help />
          </IconButton>
          <Avatar
            src="https://placehold.co/36x36"
            className="w-10 h-10 outline-1 outline-primary-light"
          />
        </Stack>
      </Box>

      {/* 진행 상태 */}
      <Box className="w-full h-24 relative">
        <Box className="w-[1044px] h-2.5 left-[58px] top-[24px] absolute bg-green-200 rounded-2xl" />
        <Typography className="left-[132px] top-[59px] absolute text-black text-sm font-normal font-['Public_Sans']">
          운송중
        </Typography>
        <Box className="w-10 h-10 left-[131px] top-[12px] absolute bg-white rounded-full border-[3px] border-emerald-600" />
      </Box>

      <Container maxWidth="xl" className="mt-8">
        {/* 메뉴 버튼 */}
        <Box className="mb-8">
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="primary">
              선적정보
            </Button>
            <Button variant="contained" disabled>
              서류정보
            </Button>
            <Button variant="contained" disabled>
              화물 정보
            </Button>
            <Button variant="contained" disabled>
              히스토리
            </Button>
          </Stack>
        </Box>
        <DetailForm title="계약 정보" />
      </Container>
    </div>
  );
}
