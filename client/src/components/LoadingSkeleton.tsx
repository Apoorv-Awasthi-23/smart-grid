import { motion } from "framer-motion";
import { Column } from "../types/types";

interface LoadingSkeletonProps<T> {
  columns: Column<T>[];
  mode: "light" | "dark";
}

const LoadingSkeleton = <T,>({ columns, mode }: LoadingSkeletonProps<T>) => {
  return (
    <>
      <div className="flex">
        {columns.map((_, index) => (
          <motion.div
            key={index}
            className={`flex-1 p-3 border-b ${
              mode === "light" ? "bg-gray-100" : "bg-gray-700"
            }`}
            style={{ minWidth: `${100 / (columns.length + 1)}%` }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="h-6 rounded bg-gray-200 dark:bg-gray-600" />
          </motion.div>
        ))}
        <motion.div
          className={`p-3 border-b ${
            mode === "light" ? "bg-gray-100" : "bg-gray-700"
          }`}
          style={{ minWidth: `${100 / (columns.length + 1)}%` }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-6 rounded bg-gray-200 dark:bg-gray-600" />
        </motion.div>
      </div>
      {[...Array(10)].map((_, rowIndex) => (
        <div key={rowIndex} className="flex">
          {columns.map((_, colIndex) => (
            <motion.div
              key={colIndex}
              className="flex-1 p-3 border-b"
              style={{ minWidth: `${100 / (columns.length + 1)}%` }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: rowIndex * 0.1,
              }}
            >
              <div
                className={`h-4 rounded ${
                  mode === "light" ? "bg-gray-100" : "bg-gray-700"
                }`}
              />
            </motion.div>
          ))}
          <motion.div
            className="p-3 border-b"
            style={{ minWidth: `${100 / (columns.length + 1)}%` }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: rowIndex * 0.1,
            }}
          >
            <div
              className={`h-4 rounded ${
                mode === "light" ? "bg-gray-100" : "bg-gray-700"
              }`}
            />
          </motion.div>
        </div>
      ))}
    </>
  );
};

export default LoadingSkeleton;
