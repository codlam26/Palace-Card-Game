import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "./Card";
import { CardType } from "@/app/games/palace/types/PalaceTypes";

interface DiscardPileModalProps {
  pile: CardType[];
  isOpen: boolean;
  onClose: () => void;
}

export default function DiscardPileModal( { pile, isOpen, onClose }: DiscardPileModalProps){
    return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as="div"
          className="fixed inset-0 z-50 flex items-center justify-center"
          open={isOpen}
          onClose={onClose}
        >
          {/* Background overlay */}
          <DialogBackdrop
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded p-6 max-w-lg mx-auto w-full shadow-lg z-50"
          >
            <DialogTitle className="text-lg font-bold mb-4 text-center">
              Discard Pile ({pile.length} cards)
            </DialogTitle>

            <div className="flex flex-wrap gap-2 mb-4 max-h-[400px] overflow-y-auto justify-center">
              {pile.map((card, i) => (
                <Card key={`pile-${card.id}-${i}`} card={card} isFaceUp isStatic layoutId={card.id} />
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}