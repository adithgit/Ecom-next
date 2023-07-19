"use client"

import { useStoreModal } from "@/hooks/use-store-modal"
import Modal from "../ui/modal"
import * as z from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// Schema for zod validation
const formSchema = z.object({
    name: z.string().min(1),
})

export const StoreModal = () => {
    const storeModal = useStoreModal();

    // Form validation
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
    }
    return (
        <Modal 
        title="Create Store"
        description="Add a new store to manage products and categories"
        isOpen={storeModal.isOpen}
        onClose={storeModal.onClose}>
            <div className="space-y-4 py-4 pb-4">
                <Form {...form}>
                    <form action="" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>
                                      Name
                                  </FormLabel>
                                  <FormControl>
                                      <Input placeholder="E-Commerce" {...field} />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                        )} />
                        <div className="flex item-center pt-6 space-x-2 justify-end w-full">
                            <Button variant={"outline"} onClick={storeModal.onClose}> Cancel </Button>
                            <Button type="submit"> Continue </Button>
                        </div>
                    </form>
                </Form>
            </div>
    </Modal>
    )
}