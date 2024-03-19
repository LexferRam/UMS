import { Chip, Avatar, Typography } from "@material-tailwind/react";

interface IChipWithAvatar{
    name: string,
    profilePicture?: string,
}

export function ChipWithAvatar({
    name,
    profilePicture
}: IChipWithAvatar) {
    return (
        <Chip
            icon={
                <Avatar
                    placeholder=''
                    size="xxl"
                    variant="circular"
                    className="h-full w-full"
                    alt={name}
                    src={profilePicture || '/icon-512x512.png'}
                />
            }
            value={
                <Typography
                    placeholder=''
                    variant="small"
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