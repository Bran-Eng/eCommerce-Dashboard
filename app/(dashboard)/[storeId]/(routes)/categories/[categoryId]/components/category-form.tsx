'use client';

import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { Billboard, Category } from '@prisma/client';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';

import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AlertModal } from '@/components/modals/alert-modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
}

//? (1/4) Schema definition for form validation using Zod

const formSchema = z.object({
  name: z.string().min(1), //! Require at least one character for name | In order to work
  billboardId: z.string().min(1), // Require a non-empty string for billboardId
});

//? (2/4) Type inference for the values from the schema created with Zod
type CategoryFormValues = z.infer<typeof formSchema>;

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, billboards }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Category' : 'Create Category';
  const description = initialData ? 'Edit your Category' : 'Add a new Category';
  const toastMessage = initialData ? 'Category updated successfully' : 'Category created successfully';
  const action = initialData ? 'Save Changes' : 'Create';

  //? (3/4) Setup form validation with useForm
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema), // Use zodResolver for form validation from schema
    defaultValues: initialData || { name: '', billboardId: '' }, // Initalize form with provided prop (store name)
  });

  /* -------------------- Submit handler for form submition ------------------- */
  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        /* ----------------------------- Edit Category ----------------------------- */
        await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data);
      } else {
        /* ---------------------------- Create Category ---------------------------- */
        await axios.post(`/api/${params.storeId}/categories`, data);
      }

      router.refresh(); // Refresh page after success
      router.push(`/${params.storeId}/categories`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  /* --------------------- Handler for deleting Category --------------------- */
  const onDelete = async () => {
    try {
      setLoading(true);

      //? Delete Category
      await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
      router.refresh();
      router.push(`/${params.storeId}/categories`); // Redirect
      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error('Make sure you deleted all products using this category first');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)} // Close modal handler
        onConfirm={onDelete} // Delete Handler
        loading={loading}
      />
      <div className='flex items-center justify-between'>
        <Heading
          title={title}
          description={description}
        />

        {/* Render Delete button only if there is data */}
        {initialData && (
          <Button
            disabled={loading}
            variant='destructive'
            size='icon'
            onClick={() => setOpen(true)}>
            <Trash className='h-4 w-4' />
          </Button>
        )}
      </div>
      <Separator /> {/* UI separator */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)} //? (4/4)
          className='space-y-8 w-full'>
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='name' // Field name for validation, <Input />
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='Category Name'
                      {...field} // Spread field props (onChange, onBlur...)
                    />
                  </FormControl>
                  <FormMessage /> {/* Validation Message Display */}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='billboardId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder='Select a Billboard'
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem
                          key={billboard.id}
                          value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={loading}
            className='ml-auto'
            type='submit'>
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
