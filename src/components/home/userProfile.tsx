import {useOutletContext} from "react-router-dom";

export default function UserProfile() {
    const [profile] = useOutletContext()

    return (
        <>
            <div className="main-container">
                <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex justify-end px-4 pt-4">
                    </div>
                    <div className="flex flex-col items-center pb-10">
                        <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={profile?.picture} alt="Bonnie image"/>
                        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{profile?.name}</h5>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{profile?.nickname}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{profile?.email}</span>
                    </div>
                </div>
            </div>
        </>
    )
}