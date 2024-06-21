'use client'

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import { autocompleteClasses, AutocompleteGetTagProps, styled, useAutocomplete } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { useFieldArray, useForm } from 'react-hook-form'
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Image from "next/image"
import { DevTool } from "@hookform/devtools";
import { LoadingContext } from "@/context/LoadingProvider"
import { enqueueSnackbar } from "notistack"

interface IAddPatientModal {
    refetch?: any,
    patient?: any
}

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

const Label = styled('label')`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const InputWrapper = styled('div')(
    ({ theme }) => `
    width: 100%;
    border: 1px solid ${theme.palette.mode === 'dark' ? '#434343' : '#d9d9d9'};
    background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
    border-radius: 4px;
    padding: 1px;
    display: flex;
    flex-wrap: wrap;
  
    &:hover {
      border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
    }
  
    &.focused {
      border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  
    & input {
      background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
      color: ${
        theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,.85)'
      };
      height: 30px;
      box-sizing: border-box;
      padding: 4px 6px;
      width: 0;
      min-width: 30px;
      flex-grow: 1;
      border: 0;
      margin: 0;
      outline: 0;
    }
  `,
  );

  interface TagProps extends ReturnType<AutocompleteGetTagProps> {
    label: string;
    img: string;
  }
  
  function Tag(props: TagProps) {
    const { label, img, onDelete, ...other } = props;

    return (
        <div {...other}>
            <Image
                src={img}
                alt=''
                height={20}
                width={20}
                className='rounded-full cursor-pointer mr-2'
            />
            <span>{label}</span>
            <CloseIcon onClick={onDelete} />
        </div>
    );
  }

  const StyledTag = styled(Tag)<TagProps>(
    ({ theme }) => `
    display: flex;
    align-items: center;
    height: 24px;
    margin: 2px;
    line-height: 22px;
    background-color: ${
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#fafafa'
    };
    border: 1px solid ${theme.palette.mode === 'dark' ? '#303030' : '#e8e8e8'};
    border-radius: 2px;
    box-sizing: content-box;
    padding: 0 4px 0 10px;
    outline: 0;
    overflow: hidden;
  
    &:focus {
      border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
      background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
    }
  
    & span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  
    & svg {
      font-size: 22px;
      cursor: pointer;
      padding: 4px;
    }
  `,
  );

  const Listbox = styled('ul')(
    ({ theme }) => `
    width: 350px;
    margin: 2px 0 0;
    padding: 0;
    position: absolute;
    list-style: none;
    background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
    overflow: auto;
    max-height: 250px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1;
  
    & li {
      padding: 5px 12px;
      display: flex;
  
      & span {
        flex-grow: 1;
      }
  
      & svg {
        color: transparent;
      }
    }
  
    & li[aria-selected='true'] {
      background-color: ${theme.palette.mode === 'dark' ? '#2b2b2b' : '#fafafa'};
      font-weight: 600;
  
      & svg {
        color: #1890ff;
      }
    }
  
    & li.${autocompleteClasses.focused} {
      background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
      cursor: pointer;
  
      & svg {
        color: currentColor;
      }
    }
  `,
  );

  function CustomizedHook({specialistsAssigned, register, setValue,readySpecialistList}: any ) {

    const {
      getRootProps,
      getInputLabelProps,
      getInputProps,
      getTagProps,
      getListboxProps,
      getOptionProps,
      groupedOptions,
      value,
      focused,
      setAnchorEl,
    } = useAutocomplete({
      id: 'customized-hook-demo',
      defaultValue: readySpecialistList,
      multiple: true,
      options: specialistsAssigned,
      getOptionLabel: (option: any) => option.name,
    });

    useEffect(() => {
        const unique = [...new Map(value.map(item => [item._id, item])).values()]
        setValue('readySpecialistList', unique)
    },[value])
  
      return (
          <>
              <div {...getRootProps()} className="w-full">
                  <Label {...getInputLabelProps()}>Dado de alta por:</Label>
                  <InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
                      {[...new Map(value.map(item => [item._id, item])).values()].map((option: typeof specialistsAssigned, index: number) => {
                          const { key, ...tagProps } = getTagProps({ index });
                          return (<StyledTag key={key} {...tagProps} label={option.name} img={option.lastname} />)
                      })}
                      <input
                          {...register('readySpecialistList',
                              {
                                  required: false
                              })} {...getInputProps()}
                      />
                  </InputWrapper>
              </div>
              {groupedOptions.length > 0 ? (
                  <Listbox {...getListboxProps()}>
                      {(groupedOptions as typeof specialistsAssigned).map((option: any, index: any) => {
                          const { key, ...optionProps }: any = getOptionProps({ option, index });
                          return (
                              <li key={key} {...optionProps}>
                                  <Image
                                      src={option.lastname}
                                      alt=''
                                      height={20}
                                      width={20}
                                      className='rounded-full cursor-pointer mr-2'
                                  />
                                  <span>{option.name}</span>
                                  <CheckIcon fontSize="small" />
                              </li>
                          );
                      })}
                  </Listbox>
              ) : null}
          </>
      );
  }
  
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

export function EditPatientModal({ refetch, patient }: IAddPatientModal) {

    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(patient.isActive);
    const { register, handleSubmit, formState: { errors }, setValue, control} = useForm()
    const { setLoading } = useContext(LoadingContext) as any

    const specialistsAssigned = patient?.specialistAssigned

    const onSubmit = async (data: any) => {

        try {
            setLoading(true)
            let respPatients = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/patient`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: patient._id,
                    name: data.name.trim(),
                    lastname: data.lastname.trim(),
                    dateOfBirth: data.dateOfBirth,
                    diagnosis: data.diagnosis,
                    historyDescription: data.historyDescription,
                    isActive: data.isActive,
                    readySpecialistList: data.readySpecialistList.map((especialista: any) => especialista._id)
                })
            })
            if (respPatients.ok) {
                await respPatients.json()
                await refetch()
                setOpen(false)
                setLoading(false)
                enqueueSnackbar('Paciente actualizado exitosamente!', {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                    autoHideDuration: 5000,
                    key: 'error-delete-event'
                })
                return
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
            enqueueSnackbar('Error actualizando paciente', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
                autoHideDuration: 5000,
                key: 'error-delete-event'
            })
        }
    }

    useEffect(()=> {
        setValue('name', patient.name)
        setValue('lastname', patient.lastname)
        setValue('dateOfBirth', patient.dateOfBirth)
        setValue('diagnosis', patient.diagnosis)
        setValue('historyDescription', patient.historyDescription)
        setValue('isActive', patient.isActive)
        setValue('readySpecialistList', patient.readySpecialistList)
    },[])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div
                    onClick={() => setOpen(true)}
                    className="flex gap-1 cursor-pointer items-center"
                >
                    <PencilSquareIcon
                        className="h-6 w-6 text-green-500"
                    />
                    <span
                        className='text-sm font-semibold text-gray-600'
                    >
                        Editar
                    </span>
                </div>
            </DialogTrigger>

            <DialogContent className="max-w-[500px] sm:max-w-[425px] overflow-y-scroll">
                <div className='max-h-[500px] sm:max-h-[550px]'>
                    <DialogHeader>
                        <DialogTitle>Editar Paciente</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="grid gap-4 py-4">
                            <div className="flex flex-row gap-2">
                                <div className="flex flex-col items-start">
                                    <Label className="text-right">
                                        Nombre:
                                    </Label>
                                    <Input
                                        type="text"
                                        defaultValue=""
                                        autoFocus={false}
                                        {...register("name",
                                            {
                                                required: 'Ingrese el nombre',
                                                min: { value: 4, message: "The min length is 4 characters" }
                                            })}
                                    />
                                    {errors.name && <p className="text-red-700">{JSON.stringify(errors?.name?.message)}</p>}
                                </div>

                                <div className="flex flex-col items-start">
                                    <Label className="text-right">
                                        Apellido:
                                    </Label>
                                    <Input
                                        type="text"
                                        defaultValue=""
                                        {...register("lastname",
                                            {
                                                required: 'ingrese el apellido',
                                                min: { value: 4, message: "The min length is 4 characters" }
                                            })}
                                    />
                                    {errors.lastname && <p className="text-red-700">{JSON.stringify(errors?.lastname?.message)}</p>}
                                </div>
                            </div>

                            <div className="flex flex-col items-start">
                                <Label className="text-right">
                                    Fecha de nacimiento:
                                </Label>
                                <input
                                    type="date"
                                    {...register("dateOfBirth",
                                        {
                                            required: 'Ingrese la fecha de nacimiento',
                                            min: { value: 4, message: "The min length is 4 characters" }
                                        })}
                                    className="w-full"
                                />
                                {errors.dateOfBirth && <p className="text-red-700">{JSON.stringify(errors?.dateOfBirth?.message)}</p>}
                            </div>

                            <div className="flex flex-col items-start">
                                <Label className="text-right">
                                    Diagnóstico:
                                </Label>
                                <Input
                                    type="text"
                                    defaultValue=""
                                    {...register("diagnosis",
                                        {
                                            required: 'Ingrese el diagnostico',
                                            min: { value: 4, message: "The min length is 4 characters" }
                                        })}
                                />
                                {errors.diagnosis && <p className="text-red-700">{JSON.stringify(errors?.diagnosis?.message)}</p>}

                            </div>

                            <div className="flex flex-col items-start">
                                <Label className="text-right">
                                    Motivo de consulta:
                                </Label>
                                <Textarea
                                    defaultValue=""
                                    className="h-[180px]"
                                    {...register("historyDescription",
                                        {
                                            required: 'ingrese el motivo de consulta',
                                            min: { value: 10, message: "The min length is 10 characters" }
                                        })}
                                />
                                {errors.historyDescription && <p className="text-red-700">{JSON.stringify(errors?.historyDescription?.message)}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    className="bg-green-700"
                                    {...register("isActive")}
                                    checked={active}
                                    onCheckedChange={(e) => {
                                        setActive(e)
                                        setValue('isActive', e)
                                    }}
                                />
                                <Label>Activar/Desactivar</Label>
                            </div>

                            <div className="flex items-center">
                                <CustomizedHook
                                    register={register}
                                    specialistsAssigned={specialistsAssigned} 
                                    setValue={setValue}
                                    readySpecialistList={patient.readySpecialistList}
                                />
                            </div>

                        </div>

                        <DialogFooter>
                            <button
                                className=" w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ffc260] hover:bg-[#f8b84e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f8fafc]"
                                type="submit"
                            >
                                Guardar
                            </button>
                        </DialogFooter>
                    </form>
                    <DevTool control={control} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
