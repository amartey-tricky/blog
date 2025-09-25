"use client"

import { arktypeResolver } from "@hookform/resolvers/arktype"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { type BlogStatus, BlogStatusSchema } from "@/util/validation/blog"
import { createStatus } from "../actions"

export function StatusForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BlogStatus>({
    resolver: arktypeResolver(BlogStatusSchema),
  })

  const onSubmit = async (data: BlogStatus) => {
    try {
      await createStatus(data)
      toast.success("Status created")
      reset()
    } catch (error) {
      console.error("Error creating status: ", error)
      toast.error("Error creating status")
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 p-8">
      <input
        placeholder="Enter Blog Status..."
        {...register("name")}
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
        {isSubmitting ? "Saving..." : "Create Status"}
      </button>
    </form>
  )
}
