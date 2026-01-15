"use client";
import BlockTitle from "../../_components/BlockTitle";
import { CreateGoalRequest, Goals } from "@/schemas/goal";
import AddNewButton from "../../_components/AddNewButton";
import GoalCardBase from "./GoalCardBase";
import EditButtons from "./EditButtons";
import { useGoalQuery } from "../../_hooks/useGoalQuery";
import Loading from "@/app/_components/Loading";
import DeleteGoalModal from "./DeleteGoalModal";
import { useGoalActions } from "../../_hooks/useGoalActions";
import { useEditModals } from "../_hooks/useEditModals";

interface Props {
  // goals: Goals;
  // handleAdding: () => void;
}

const GoalSection: React.FC<Props> = ({}) => {
  const goalsData = useGoalQuery();
  const actions = useGoalActions();
  const modals = useEditModals();

  if (goalsData.isLoading) return <Loading />;
  if (goalsData.error)
    return <p>目標の取得でエラーが発生しました: {goalsData.error.message}</p>;

  const goals: Goals = goalsData.data?.goals ?? [];

  const handleAdding = async (data: CreateGoalRequest) => {
    try {
      await actions.create(data, {
        onSuccess: async () => {
          modals.closeCreateGoal();
          await goalsData.mutate();
        },
      });
    } catch (error) {
      console.log("目標の作成に失敗しました");
    }
  };

  const handleEdit = async (goalId: number, data: CreateGoalRequest) => {
    try {
      await actions.update(goalId, data, {
        onSuccess: async () => {
          modals.closeUpdateGoal();
          await goalsData.mutate();
        },
      });
    } catch (error) {
      console.log("目標の更新に失敗しました");
    }
  };

  const handleDelete = async (goalId: number) => {
    try {
      await actions.deleteGoal(goalId, {
        onSuccess: async () => {
          modals.closeDeleteGoal();
          await goalsData.mutate();
        },
      });
    } catch (error) {
      console.log("目標の更新に失敗しました");
    }
  };

  return (
    <section className="mx-auto mb-4 w-full min-w-[580px] max-w-[760px] rounded-3xl bg-white p-6 shadow-md">
      <BlockTitle title="Goal" />
      <div className="space-y-2">
        {goals.map((g) => {
          <GoalCardBase
            goal={g.title}
            deadline={g.deadline}
            onClick={() => handleEdit()}
            rightSlot={
              <EditButtons
                handleEdit={() => handleEdit()}
                handleDelete={() => handleDelete()}
              />
            }
          />;
        })}
      </div>
      <AddNewButton label="目標を追加" handleAdding={() => handleAdding()} />

      <DeleteGoalModal
        isOpen={}
        goal={}
        onClose={}
        onConfirm={() => handleDelete()}
        isSubmitting={}
      />
    </section>
  );
};

export default GoalSection;
