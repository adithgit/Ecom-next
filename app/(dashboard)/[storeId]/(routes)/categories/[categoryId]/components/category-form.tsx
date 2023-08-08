'use client'

import { AlertModal } from "@/components/modals/alert-modal"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Heading from "@/components/ui/heading"
import ImageUpload from "@/components/ui/image-upload"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useOrigin } from "@/hooks/user-origin"
import { zodResolver } from "@hookform/resolvers/zod"
import {  Billboard, Category, Store } from "@prisma/client"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1)
})

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
    initialData : Category | null;
    billboards: Billboard[];
}

export default function CategoryForm({ initialData, billboards }:CategoryFormProps) {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit category" : "Create category";
  const description = initialData ? "Edit a category" : "Add a new category";
  const toastMessage = initialData ? "Category Updated" : "Category created";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      billboardId: ''
    }
  });

  const onSubmit = async(data: CategoryFormValues) => {
    try {
      setLoading(true);

      let url = `/api/${params.storeId}/categories `;
      let methodType = "POST";

      if(initialData){
        url = `/api/${params.storeId}/categories/${params.categoryId}`;
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
    router.push(`/${params.storeId}/categories`)
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
      const response = await fetch(`/api/${params.storeId}/categories/${params.categoryId}`,{
        method: "DELETE",
        headers:{
            "Content-Type": "application/json",
        }
    });
    const result = await response.json();
    console.log(result);
    router.refresh();
    router.push(`/${params.storeId}/categories`)
    toast.success("Category deleted.")
    } catch (error) {
      toast.error("Make sure you removed all products using this category first.");
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
            <div className="grid grid-cols-3 gap-8">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Category name" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="billboardId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a billboard" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        billboards.map(( billboard ) => (
                          <SelectItem key={billboard.id} value={billboard.id}>
                            { billboard.label }
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
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
