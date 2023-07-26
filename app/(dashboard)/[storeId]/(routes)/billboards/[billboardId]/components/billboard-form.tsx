'use client'

import { AlertModal } from "@/components/modals/alert-modal"
import ApiAlert from "@/components/ui/api-alert"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Heading from "@/components/ui/heading"
import ImageUpload from "@/components/ui/image-upload"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useOrigin } from "@/hooks/user-origin"
import { zodResolver } from "@hookform/resolvers/zod"
import { Billboard, Store } from "@prisma/client"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from 'zod';

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1)
})

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
    initialData : Billboard | null
}

export default function BillboardForm({ initialData }:BillboardFormProps) {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData ? "Edit a billboard" : "Add a new billboard";
  const toastMessage = initialData ? "Billboard Updated" : "Billboard created";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: ''
    }
  });

  const onSubmit = async(data: BillboardFormValues) => {
    try {
      setLoading(true);

      let url = `/api/${params.storeId}/billboards`;
      let methodType = "POST";

      if(initialData){
        url = `/api/${params.storeId}/billboards/${params.billboardId}`;
        methodType = "PATCH"
      } 

      const response = await fetch(url, {
        method: methodType,
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log(result);
    router.refresh();
    router.push(`${params.storeId}/billboards`)
    toast.success(toastMessage);

    } catch (error) {
      toast.error("Something went wrong.");
    } finally{
      setLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/${params.storeId}/billboards/${params.billboardId}`,{
        method: "DELETE",
        headers:{
            "Content-Type": "application/json",
        }
    });
    const result = await response.json();
    console.log(result);
    router.refresh();
    router.push("/")
    toast.success("Billboard deleted.")
    } catch (error) {
      toast.error("Make sure you removed all categories first.");
    } finally{
      setLoading(false);
      setOpen(false);
    }
  }
  return (
    <>
    <AlertModal 
     isOpen={open}
     onClose={() => setOpen(false)}
     onConfirm={onDelete}
     loading={loading}
    />
    <div className="flex items-center justify-between">
        <Heading
        title={title}
        description={description} />
        {
          initialData &&
         <Button
          variant="destructive"
          size="icon"
          onClick={() => {setOpen(true)}}
          disabled={loading}
          >
           <Trash className="h-4 w-4" />
         </Button>
        }     
    </div>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
            <div className="grid grid-cols-3 gap-8">
              <FormField control={form.control} name="label" render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Billboard label" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
            </div>
            <Button disabled={loading} className="ml-auto" type="submit">
              {action}
            </Button>
          </form>
        </Form>
        <Separator />
  </>
  )
}
