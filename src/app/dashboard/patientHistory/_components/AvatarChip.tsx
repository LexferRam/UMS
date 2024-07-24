import { Avatar, Chip, Typography } from "@mui/material"

interface IChipWithAvatar {
    name: string,
    profilePicture?: string,
    therapistSelected: string
}

export function ChipWithAvatar({
    name,
    profilePicture,
    therapistSelected
}: IChipWithAvatar) {
    return (
        <>
            {
                therapistSelected === name || therapistSelected === 'Todos' ? (
                    <Chip
                        avatar={
                            <Avatar
                                className="h-full w-full"
                                alt={name}
                                src={profilePicture || '/icon-512x512.png'}
                            />
                        }
                        label={
                            <Typography
                                variant="caption"
                                color="white"
                                className="font-medium capitalize leading-none text-white"
                            >
                                {name}
                            </Typography>
                        }
                        className="rounded-full px-4 bg-[#49d3e2]  space-x-3 cursor-pointer"
                    />
                ) : (
                    <Chip
                        avatar={
                            <Avatar
                                className="h-full w-full"
                                alt={name}
                                src={profilePicture || '/icon-512x512.png'}
                            />
                        }
                        label={
                            <Typography
                                variant="caption"
                                color="white"
                                className="font-medium capitalize leading-none text-[#16b3c4]"
                            >
                                {name}
                            </Typography>
                        }
                        className="rounded-full px-4 bg-[#cdf3f7] space-x-3 cursor-pointer"
                    />
                )
            }
        </>
    )
}