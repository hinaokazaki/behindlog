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
import { EditModal } from "../../_components/EditModal";
import { ButtonProps, FieldProps } from "@/app/_types/type";

const GoalSection: React.FC = () => {
  const goalsData = useGoalQuery();
  const actions = useGoalActions();
  const modals = useEditModals();

  const fields: FieldProps[] = [
    {
      name: "title",
      title: "目標",
      type: "text",
      inputProps: { placeholder: "目標を決めよう！" },
    },
    {
      name: "deadline",
      title: "期限",
      type: "date",
      inputProps: { placeholder: "期限を選択してください" },
    },
  ];

  const createModalButtons: ButtonProps[] = [
    {
      children: "キャンセル",
      className: "",
      type: "button",
      disabled: actions.isSubmitting,
      onClick: modals.selectedGoal ? modals.closeUpdateGoal : modals.closeCreateGoal,
      color: "red",
      variant: "outlined",
    },
    {
      children: "作成",
      className: "",
      type: "submit",
      disabled: actions.isSubmitting,
      color: "red",
      variant: "filled",
    },
  ];

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
        {goals.map((g) => (
          <GoalCardBase
            goal={g.title}
            deadline={g.deadline}
            onClick={() => modals.openUpdateGoal(g)}
            rightSlot={
              <EditButtons
                handleEdit={() => modals.openUpdateGoal(g)}
                handleDelete={() => modals.openDeleteGoal(g)}
              />
            }
          />
        ))}
      </div>
      <AddNewButton
        label="目標を追加"
        handleAdding={() => modals.openCreateGoal()}
      />

      <EditModal 
        modalTitle="新しい目標"
        isOpen={modals.isCreateGoalOpen}
        onClose={modals.closeCreateGoal}
        onSubmit={handleAdding}
        buttons={createModalButtons}
        fields={fields}
      />

      {modals.selectedGoal && (
        <EditModal 
          modalTitle="目標を編集する"
          isOpen={modals.isUpdateGoalOpen}
          onClose={() => modals.closeUpdateGoal()}
          onSubmit={(data) => {
            handleEdit(modals.selectedGoal!.id, data)}
          }
          defaultValues={{
            title: modals.selectedGoal.title,
            deadline: modals.selectedGoal.deadline,
          }}
          buttons={createModalButtons}
          fields={fields}
        />
      )}
      
      {modals.selectedGoal && (
        <DeleteGoalModal
          isOpen={modals.isDeleteGoalOpen}
          goal={modals.selectedGoal}
          onClose={() => modals.closeDeleteGoal()}
          onConfirm={() => {
            handleDelete(modals.selectedGoal!.id)}
          }
          isSubmitting={actions.isSubmitting}
        />
      )}
    </section>
  );
};

export default GoalSection;
