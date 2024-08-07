'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

import { Modal } from '@/components/ui/modal'; // Modal component
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useStoreModal } from '@/hooks/use-store-modal'; // Custom Hook that uses zustand for global state management
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  name: z.string().min(1).max(50),
});

export const StoreModal = () => {
  const storeModal = useStoreModal(); // Accessing the custom hook

  const [loading, setLoading] = useState(false);

  // Define the Form using useForm Hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // Zod schema for validation
    defaultValues: {
      name: '',
    },
  });

  // Asynchronous Submit Handler: A function that processes the form values upon submission, ensuring they are validated and type-safe.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('values', values);
    // try {
    //   setLoading(true); // request is in progress

    //   // Make a POST request to the '/api/stores' endpoint with the form values
    //   const response = await axios.post('/api/stores', values);

    //   // Redirect the user to the new store page (dashboard) using the ID from the response
    //   window.location.assign(`/${response.data.id}`);
    // } catch (error) {
    //   toast.error('Something went wrong');
    // } finally {
    //   // request is complete
    //   setLoading(false);
    // }
  };

  return (
    <Modal
      title='Create Store'
      description='Add a new store to manage products and categories'
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}>
      <div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}></form>
          </Form>

          {/* Pass the form methods and properties to the Form component */}
          <Form {...form}>
            {/* Form tag with handleSubmit to validate and handle form submission */}
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-8'>
              {/* FormField component to handle the username field */}
              <FormField
                control={form.control} // Bind form control to the field
                name='name' // Name of the field
                render={({ field }) => (
                  // The field object contains auto generated: name, value, onChange, onBlur
                  // Render the form item with its children
                  <FormItem>
                    {/* Label for the username input */}
                    <FormLabel>Username</FormLabel>
                    {/* Control wrapper for the input */}
                    <FormControl>
                      {/* Input component with placeholder and binding to form control */}
                      <Input
                        placeholder='shadcn'
                        {...field}
                      />
                    </FormControl>
                    {/* Description for the username field */}
                    <FormDescription>This is your public display name.</FormDescription>
                    {/* Message component to display validation messages */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Submit button to submit the form */}
              <Button type='submit'>Submit</Button>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

//? https://ui.shadcn.com/docs/components/form
