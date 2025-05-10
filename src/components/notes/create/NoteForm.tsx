import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { TravelNoteDTO } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z
    .string()
    .min(100, "Content must be at least 100 characters")
    .max(10000, "Content must not exceed 10000 characters"),
});

type FormData = z.infer<typeof formSchema>;

export interface NoteFormProps {
  onCancel: () => void;
  onSuccess: (note: TravelNoteDTO) => void;
}

export function NoteForm({ onCancel, onSuccess }: NoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/travel-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to create note");
      }

      const note = await response.json();
      toast.success("Note created successfully!");
      onSuccess(note);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create note");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-test-id="create-note-form">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter note title..." {...field} data-test-id="note-title-input" />
              </FormControl>
              <FormMessage data-test-id="note-title-error" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your travel note content..."
                  className="min-h-[200px]"
                  {...field}
                  data-test-id="note-content-input"
                />
              </FormControl>
              <FormMessage data-test-id="note-content-error" />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={onCancel} data-test-id="note-cancel-button">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} data-test-id="note-submit-button">
            {isSubmitting ? "Creating..." : "Create Note"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
