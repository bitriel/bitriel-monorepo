import BottomSheet from "@gorhom/bottom-sheet";
import { useRef } from "react";

const useBottomSheet = () => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    const handleOpenBottomSheet = () => () => {
        bottomSheetRef.current?.expand();
    };

    const handleCloseBottomSheet = () => () => {
        bottomSheetRef.current?.close();
    };

    return { bottomSheetRef, handleOpenBottomSheet, handleCloseBottomSheet };
};

export default useBottomSheet;
