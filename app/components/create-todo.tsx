import { Form, useFetcher } from "@remix-run/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Button } from "~/components/ui/button";
import { CopyPlus, Save, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { TodoContent } from "~/db";
import { Checkbox } from "./ui/checkbox";

export default function CreateTodo({
  ...props
}: React.ComponentProps<typeof Dialog>) {
  const [todoTitle, setTodoTitle] = useState("");
  const [todosContent, setTodosContent] = useState<TodoContent[]>([]);

  function addTodosContent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const targetForm = e.target as HTMLFormElement;
    const { title } = Object.fromEntries(new FormData(targetForm)) as {
      title: string;
    };

    const content_id = new Date().getTime() + "";

    setTodosContent((prev) => [
      ...prev,
      { content_id, title, isChecked: false },
    ]);

    targetForm.reset();
  }

  function updateTodoCheckbox(checked: boolean | string, content_id: string) {
    console.log(checked, content_id);
  }

  function removeTodoContent() {}

  // function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault();

  //   const targetForm = e.target as HTMLFormElement;
  //   const formData = Object.fromEntries(new FormData(targetForm));

  //   console.log(formData);
  // }

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Todo Baru</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Input
          placeholder="Judul Todo"
          defaultValue={todoTitle}
          onChange={({ target }) => setTodoTitle(target.value)}
        />

        <Separator className="my-1" />

        {todosContent.length > 0 && (
          <div className="grid max-h-96 gap-4 overflow-auto">
            {todosContent.map(({ content_id, title, isChecked }, key) => {
              return (
                <label
                  key={key}
                  htmlFor={content_id}
                  className="flex select-none items-center gap-2"
                >
                  <div className="flex grow items-center gap-2">
                    <Checkbox
                      onCheckedChange={(val) =>
                        updateTodoCheckbox(val, content_id!)
                      }
                      id={content_id}
                      defaultChecked={isChecked}
                    />
                    <span className="max-w-96 truncate">{title}</span>
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="size-8"
                  >
                    <Trash2 />
                  </Button>
                </label>
              );
            })}
          </div>
        )}

        <Form onSubmit={addTodosContent} className="flex gap-4">
          <Input
            required
            name="title"
            placeholder="Tulis Todo Disini"
            maxLength={40}
          />
          <Button type="submit" variant="outline">
            <CopyPlus />
          </Button>
        </Form>
        <Separator className="my-1" />
        <Button className="w-full">
          <Save />
          Simpan
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// <Form onSubmit={handleSubmit}>
// <Input
//   name="title"
//   required
//   placeholder="Judul Todo"
//   onKeyDown={(e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//     }
//   }}
// />
//   <Separator className="my-4" />
//   <div className="grid gap-4">
//     {/*
// <label
//   htmlFor="tugas-wak"
//   className="flex select-none items-center gap-2"
// >
//   <div className="flex grow items-center gap-2">
//     <Checkbox id="tugas-wak" />
//     <span className="max-w-96 truncate">
//       tugas wak alamak aduh sakit nye awak ku nak meletup je ni awak
//     </span>
//   </div>
//   <Button
//     type="button"
//     size="icon"
//     variant="outline"
//     className="size-8"
//   >
//     <Trash2 />
//   </Button>
// </label>
// */}

//     <div className="flex gap-4">
// <Input
//   placeholder="Tulis Todo Disini"
//   maxLength={40}
//   onKeyDown={(e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//     }
//   }}
// />
// <Button type="button" variant="outline">
//   <CopyPlus />
// </Button>
//     </div>
//   </div>
//   <Separator className="my-4" />
// <Button type="submit" className="w-full">
//   <Save />
//   Simpan
// </Button>
// </Form>
