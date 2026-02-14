"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SizeForm } from "@/components/admin/forms/size-form";
import { fetchSize } from "@/lib/client/api";

export default function EditSizePage() {
  const params = useParams();
  const sizeId = params.id as string;

  const { data: size, isLoading, isError } = useQuery({
    queryKey: ["size", sizeId],
    queryFn: () => fetchSize(sizeId),
    enabled: !!sizeId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="font-mono text-primary">LOADING...</div>
      </div>
    );
  }

  if (isError || !size) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="font-mono text-red-500">SIZE NOT FOUND</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <SizeForm
        sizeId={sizeId}
        initialData={size}
      />
    </div>
  );
}
