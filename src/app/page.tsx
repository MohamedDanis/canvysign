"use client"
import Image from 'next/image'
import React, { useEffect, Fragment, useRef, useState } from 'react'
import { MdModeEdit, MdDelete } from "react-icons/md";
import Navbar from '@/components/Navbar/Navbar';
import { Dialog, Transition } from '@headlessui/react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dynamic from 'next/dynamic';
import s3 from '@/utils/s3'
import { v4 as uuidv4 } from 'uuid';
import { TailSpin } from 'react-loader-spinner'
import supabase from '@/utils/supabase';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const DynamicDrawingCanvas = dynamic(() => import('../components/DrawingCanvas/DrawingCanvas'), {
    ssr: false, // Ensure this component is only rendered on the client-side
    loading: () => <div className='flex justify-center'>
        <TailSpin
            height="80"
            width="80"
            color="#000"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
        />
    </div>, // Optional loading indicator
});
function Page() {
    const childRef = useRef<any>(null);
    let [isOpen, setIsOpen] = useState(false)
    const notify = () => {
  
        // toast(msg,{
        //     position: toast.POSITION.TOP_RIGHT,
        //     className:'text-neutral-900 '
        // })
        toast.success("Success Notification !", {
            position: toast.POSITION.TOP_CENTER
          });
    
          toast.error("Error Notification !", {
            position: toast.POSITION.TOP_LEFT
          });
      };
    async function closeModal() {

        await setIsOpen(dataFromChild || false);
        console.log(isOpen, 'isopen');



    }

    function openModal() {
        
        setIsOpen(true)
    }
    const [startDate, setStartDate] = useState<any>(new Date());

    const [open, setOpen] = useState(false)

    const cancelButtonRef = useRef(null)

    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [data, setData] = useState<any>([]);
    const id = uuidv4();


    const supabaseHandle = async () => {
        const { data, error } = await supabase
            .from('signdata')
            .select('*')
        
        setData(data)

    }
    const [dataFromChild, setDataFromChild] = useState(null);
    const [nameFromChild, setNameFromChild] = useState('');
    const [dateFromChild, setDateFromChild] = useState('');
    const [signName, setSignName] = useState('');
    //recieves data from child
    const handleDataFromChild = async (data: any) => {
        await setDataFromChild(data);
        await closeModal()

    };

    const handleOpen = () => {
        setTimeout(() => {
            toast.success("Signature added successfully", {
                position: toast.POSITION.TOP_CENTER
                });
            setIsOpen(false)
            
        }, 2000);
    }

    /**
     * Deletes an object from the S3 bucket "canvisign" and reloads the page.
     * param a - The key of the object to be deleted.
     */

    const handleDelete = async (a: any) => {
        console.log(a);
        const objectParams = {
            Bucket: "canvisign",
            Key: a,
        };
        try {
            const { data, error } = await supabase
                .from('signdata')
                .delete()
                .eq('signName', a)
            toast.error("Signature deleted successfully", {
                position: toast.POSITION.TOP_CENTER
                });
                setIsDelete(true)
            await s3.deleteObject(objectParams).promise()
            
            console.log(`File "${a}" deleted successfully.`);
        } catch (error) {
            console.error(`Error deleting file "${a}":`, error);
        }

    }



    useEffect(() => {
        supabaseHandle()
       
        if (dataFromChild !== null) {
            // window.location.reload();
            handleOpen()
        }
    }, [dataFromChild,isDelete])



    return (
        <>
            <Navbar />
            <div className=" p-12 flex justify-center flex-col items-center">
                <button className='btn md:px-5 md:py-3 font-medium md:w-1/3 w-fit px-5 py-2 my-4' onClick={openModal}>Add New</button>
                <div className="flex w-full flex-col">
                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                            <div className="overflow-hidden">
                                <table className="min-w-full text-left text-sm font-light border-2 border-neutral-900">
                                    <thead className="border-b font-medium border-neutral-950">
                                        <tr>
                                            <th scope="col" className="px-6 py-4">#</th>
                                            <th scope="col" className="px-6 py-4">Name</th>
                                            <th scope="col" className="px-6 py-4">Date</th>
                                            <th scope="col" className="px-6 py-4">Signature</th>
                                            <th scope="col" className="px-6 py-4">Actions</th>
                                        </tr>
                                    </thead>
                                    {data.length > 0 ? (
                                        <tbody>
                                            {data.map((item: any, index: any) => {
                                                return (
                                                    <tr className="border-b dark:border-neutral-500" key={index}>
                                                        <td className="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">{item.name}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">{item.Date}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">
                                                            <Image src={`https://canvisign.s3.ap-southeast-2.amazonaws.com/${item.signName}`} width={200} height={100} alt="sign"></Image>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4">
                                                            <div className='flex gap-10'>
                                                                <MdModeEdit className='w-8 h-auto cursor-pointer' />
                                                                <MdDelete className='w-8 h-auto cursor-pointer' onClick={() => handleDelete(item.signName)} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    ) : (
                                        <tbody>
                                            <tr className=''>
                                                <td className='text-center h-12 relative'>
                                                    <h1 className='w-full font-semibold absolute text-3xl text-neutral-500 top-0 left-1/2'>No data</h1>
                                                </td>
                                            </tr>
                                        </tbody>
                                    )}

                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer transition={Zoom} />
            </div>



            {/* modal */}
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h2"
                                        className="text-3xl text-center font-medium leading-6 text-gray-900 py-5"
                                    >
                                        Add New Signature
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <div className='flex flex-col'>
                                            <DynamicDrawingCanvas sendDataToParent={handleDataFromChild} />
                                        </div>
                                    </div>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>

    )
}

export default Page