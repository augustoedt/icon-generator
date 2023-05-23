export function Button(props: React.ComponentPropsWithoutRef<"button">) {
    //return a blue button white text
    return (<button {...props} className="rounded bg-blue-400 px-4 py-2 hover:bg-blue-500 text-white" />);
}