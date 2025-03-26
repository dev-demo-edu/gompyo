import Plan from "@/containers/plan";

export default function PlanPage() {
  return (
    <div className="min-h-screen bg-background-paper">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-text-primary font-['Public_Sans']">
              플랜 관리
            </h1>
          </div>
          <Plan />
        </div>
      </div>
    </div>
  );
}
