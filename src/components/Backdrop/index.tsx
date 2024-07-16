import { motion } from "framer-motion";

const Backdrop = ({
  children,
  onClick,
}: {
  children: any;
  onClick: () => void;
}) => {
  return (
    <motion.div
      className="fixed inset-0 bg-dark/60 backdrop-blur z-20 cursor-pointer overflow-scroll"
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

export default Backdrop;
