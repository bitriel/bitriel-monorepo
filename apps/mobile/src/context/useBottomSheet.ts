import BottomSheet from "@gorhom/bottom-sheet";
import { useRef, useCallback } from "react";

const useBottomSheet = () => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    const handleOpenBottomSheet = useCallback(() => {
        bottomSheetRef.current?.expand();
    }, []);

    const handleCloseBottomSheet = useCallback(() => {
        bottomSheetRef.current?.close();
    }, []);

    return { bottomSheetRef, handleOpenBottomSheet, handleCloseBottomSheet };
};

export default useBottomSheet;
