import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
export const DataTable = ({ noticedata }) => {
    console.log("This is notice data", noticedata)
    const Notices = [
       
    ]

    if (noticedata) {
        for (let index = 0; index < noticedata.notices.length; index++) {
            console.log("This is notice data", noticedata.notices)
            Notices.push(
                {
                    noticeID: index + 1,
                    noticeTitle: noticedata.notices[index].title,
                    noticeAudience: noticedata.notices[index].audience,
                    noticeCreatedBy: `${noticedata.notices[index].createdby["firstname"]} ${noticedata.notices[index].createdby["lastname"]}`,
                }
            )
        }
    }

    console.log("Notice array", Notices)

    return (

        <div className="overflow-auto h-full">
            <div className="notices-heading mx-3 my-2">
                <p className="min-[250px]:text-xl xl:text-3xl font-bold min-[250px]:text-center sm:text-start">Recent Notices</p>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Notice ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Audience</TableHead>
                        <TableHead className="text-right">Created By</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>

                    {Notices.map((Notice) => (
                        <TableRow key={Notice.noticeID}>
                            <TableCell className="font-medium">{Notice.noticeID}</TableCell>
                            <TableCell>{Notice.noticeTitle}</TableCell>
                            <TableCell>{Notice.noticeAudience}</TableCell>
                            <TableCell className="text-right">{Notice.noticeCreatedBy}</TableCell>
                        </TableRow>
                    ))}

                </TableBody>

               
            </Table>
        </div>
    )
}