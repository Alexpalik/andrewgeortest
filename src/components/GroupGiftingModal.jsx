import React from "react";
import NcModal from "@/shared/NcModal/NcModal";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";

const GroupGiftingModal = ({ isOpen, onClose, onSelect }) => {
  return (
    <NcModal
      isOpenProp={isOpen}
      onCloseModal={onClose}
      modalTitle={null}
      contentExtraClass="max-w-md"
      renderContent={() => (
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-lg  text-center mb-4">
            Do you want this product to be a group gifting?
          </h2>
          <div className="flex gap-4 justify-center">
            <ButtonPrimary onClick={() => onSelect(true)}>
              Yes
            </ButtonPrimary>
            <ButtonSecondary onClick={() => onSelect(false)}>
              No
            </ButtonSecondary>
          </div>
        </div>
      )}
    />
  );
};

export default GroupGiftingModal; 