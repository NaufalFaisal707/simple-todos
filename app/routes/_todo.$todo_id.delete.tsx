import {
  ClientActionFunctionArgs,
  Form,
  useActionData,
  useNavigate,
} from "@remix-run/react";
import { Trash2 } from "lucide-react";
import { useContext, useEffect } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { TodoContext, todoState } from "~/context";
import { deleteTodoById } from "~/db";

export const clientAction = async ({ params }: ClientActionFunctionArgs) => {
  const { todo_id } = params as { todo_id: string };

  await deleteTodoById(todo_id);

  return todo_id;
};

export default function DeleteTodo() {
  const actionData = useActionData<typeof clientAction>();

  const navigate = useNavigate();

  const { setTodo } = useContext(TodoContext) as todoState;

  useEffect(() => {
    if (!actionData) return;

    setTodo((prev) => prev.filter((todo) => todo.todo_id !== actionData));

    navigate("/", { replace: true });
  }, [actionData, navigate, setTodo]);

  return (
    <Dialog open onOpenChange={() => navigate("/", { replace: true })}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ingin menghapus todo ini?</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Form method="POST">
          <Button variant="destructive" type="submit" className="w-full">
            <Trash2 />
            <span>Ya, Hapus Todo</span>
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
