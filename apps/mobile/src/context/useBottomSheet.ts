import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef, useCallback } from "react";

const useBottomSheet = () => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const handleOpenBottomSheet = useCallback(() => {
        bottomSheetRef.current?.present();
    }, []);

    const handleCloseBottomSheet = useCallback(() => {
        bottomSheetRef.current?.dismiss();
    }, []);

    return { bottomSheetRef, handleOpenBottomSheet, handleCloseBottomSheet };
};

export default useBottomSheet;
