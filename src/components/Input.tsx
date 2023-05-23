
export function Input(props: React.ComponentPropsWithoutRef<"input">){
   return <input    {...props}
        className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-400 dark:text-gray-700"    
    />
}