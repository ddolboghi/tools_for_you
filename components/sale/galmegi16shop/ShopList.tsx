"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ShopListSkeleton from "../../ui/ShopListSkeleton";
import EditShop from "./EditShop";
import { Galmegi16Shop } from "@/utils/sale/galmegi16ShopTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, LoaderCircle, X } from "lucide-react";
import { updateShop } from "@/action/galmegi16Shop";

type ShopListProps = {
  businessZone: string;
  shopList: Galmegi16Shop[];
  onFetch: () => Promise<void>;
  isLoading: boolean;
};

export default function ShopList({
  businessZone,
  shopList,
  onFetch,
  isLoading,
}: ShopListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditClick = (index: number, name: string) => {
    setEditingIndex(index);
    setEditValue(name);
    setIsInputFocused(false);
  };

  const handleSaveEdit = async (index: number, originShopName: string) => {
    if (editValue !== originShopName) {
      const isConfirmed = confirm(
        `${editValue}(으)로 수정하시겠어요?\n타 상권 업소를 수정하지 말아 주세요.`
      );
      if (isConfirmed) {
        if (editValue.trim() !== "") {
          const updatedShop = { ...shopList[index], name: editValue };
          setIsUpdating(true);
          const response = await updateShop(updatedShop.id, updatedShop.name);
          if (response) {
            await onFetch();
          }
        }
      }
    }
    setIsUpdating(false);
    setEditingIndex(null);
    setIsInputFocused(false);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setIsInputFocused(false);
  };

  useEffect(() => {
    if (editingIndex !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingIndex]);

  return (
    <Card className="mt-2 mb-4 border border-gray-300 w-full max-w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          {"<"}갈매기 16{">"}입고 업소 리스트
        </CardTitle>
        <p className="text-sm text-muted-foreground">상권명: {businessZone}</p>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <ShopListSkeleton />
        ) : shopList.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">번호</TableHead>
                <TableHead>업소명</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shopList.map((shop, index) => (
                <TableRow key={`shop-${shop.id}`}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    {editingIndex === index ? (
                      <div className="py-3 px-4">
                        <div className="relative">
                          <Input
                            ref={inputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onFocus={() => setIsInputFocused(true)}
                            disabled={isUpdating}
                            className="border-0 shadow-none focus-visible:ring-1 focus-visible:ring-offset-0 h-7 px-2 py-0 rounded bg-muted/30 focus-visible:bg-background"
                          />

                          <div
                            className={`mt-1 flex justify-end space-x-1 overflow-hidden transition-all duration-200 ease-in-out ${
                              isInputFocused
                                ? "max-h-8 opacity-100"
                                : "max-h-0 opacity-0"
                            }`}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSaveEdit(index, shop.name)}
                              disabled={isUpdating}
                              className="h-7 px-2 py-0 text-xs"
                            >
                              {isUpdating ? (
                                <LoaderCircle className="animate-spin" />
                              ) : (
                                <>
                                  <Check className="h-3.5 w-3.5 mr-1" />
                                  저장
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleCancelEdit}
                              className="h-7 px-2 py-0 text-xs"
                            >
                              <X className="h-3.5 w-3.5 mr-1" />
                              취소
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="cursor-pointer py-3 px-4 hover:bg-muted/50 rounded transition-colors"
                        onClick={() => handleEditClick(index, shop.name)}
                      >
                        {shop.name}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <EditShop shop={shop} onDelete={() => onFetch()} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center py-4 text-muted-foreground">없음</p>
        )}
      </CardContent>
    </Card>
  );
}
