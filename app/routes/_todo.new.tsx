import {
  ClientActionFunctionArgs,
  Form,
  useActionData,
  useNavigate,
} from "@remix-run/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Save } from "lucide-react";
import { useContext, useEffect } from "react";
import { addTodo, getTodoById } from "~/db";
import { TodoContext, todoState } from "~/context";

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const { title } = Object.fromEntries(await request.formData()) as {
    title: string;
  };

  const createdTodo = await addTodo({ title, isChecked: false });

  return await getTodoById(createdTodo);
};

export default function CreateTodo() {
  const actionData = useActionData<typeof clientAction>();

  const navigate = useNavigate();

  const { setTodo } = useContext(TodoContext) as todoState;

  useEffect(() => {
    if (!actionData) return;

    setTodo((prev) => [...prev, actionData]);

    navigate("/", { replace: true });
  }, [actionData, navigate, setTodo]);

  return (
    <Dialog open onOpenChange={() => navigate("/", { replace: true })}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Todo Baru</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Form method="POST" className="grid gap-4">
          <Input
            required
            name="title"
            placeholder="Tulis Todo Disini"
            maxLength={40}
          />

          <Button className="w-full" type="submit" variant="outline">
            <Save />
            Simpan
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
