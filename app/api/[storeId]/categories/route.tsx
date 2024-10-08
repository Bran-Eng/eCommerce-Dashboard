import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
// import { ObjectId } from 'mongodb'; //! Import ObjectId from mongodb | Delete if not needed

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const body = await req.json();
    const { userId } = auth();
    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse('Billboard ID is required', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    //? Create Category
    const category = await prismadb.category.create({
      data: {
        // id: new ObjectId().toString(), //! Generate a new ObjectId and store as string
        name,
        billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log(`[Categories > route.ts, POST] ${error}`, error);

    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log(`[Categories > route.ts, GET] ${error}`, error);

    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
