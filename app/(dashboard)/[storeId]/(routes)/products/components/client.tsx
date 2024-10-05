'use client';

import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

import { ProductColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table'; // DataTable component for displaying data
import { ApiList } from '@/components/ui/api-list';

interface ProductClientProps {
  data: ProductColumn[]; // An array of ProductColumn
}

export const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Products: ${data.length}`}
          description='Manage Products for your store'
        />

        {/* Button to navigate to new Billboard creation page */}
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className='mr-4 h-4 w-4' />
          Add New
        </Button>
      </div>

      <Separator />

      <DataTable
        searchKey='label'
        columns={columns}
        data={data}
      />

      {/* API section for displaying billboard-related API calls */}
      <Heading
        title='API'
        description='API calls for Products'
      />

      <Separator />

      <ApiList
        entityName='products'
        entityIdName='productId'
      />
    </>
  );
};