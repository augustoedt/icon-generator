
export const LoadingButton = ({ loading }: { loading: boolean }) => {
    return <button
        className="disabled:bg-gray-300 rounded bg-blue-400 px-4 py-2 hover:bg-blue-500 text-white">
        {`${loading ? "..." : "Generate"}`}
    </button>
}