import { Box, Container, Typography, Button, Stack } from "@mui/material";
import CargoDetail from "@/containers/cargo-detail";

export default async function DetailPage({
  params,
}: {
  params: { cargo_id: string };
}) {
  const { cargo_id } = await params;

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
        <CargoDetail cargoId={cargo_id} />
        <Box className="w-[1093px] h-[50px]" />
      </Container>
    </div>
  );
}
