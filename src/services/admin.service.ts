import { injectable } from "inversify";
import { Content, User } from "../models";

@injectable()
export class AdminService {
    async getTotalCounts(): Promise<any> {
        try {
            const userCount = await User.countDocuments()
            const contentCount = await Content.countDocuments()
            const contentCreatorCount = await User.find({ role: 'CC' }).countDocuments()
            const adminCount = await User.find({ role: 'Admin' }).countDocuments()

            return { userCount, contentCount, contentCreatorCount, adminCount }
        } catch (error) {
            throw (error)
        }
    }
    async getYearWiseContentCounts(year:string): Promise<any> {
        try {
            const yearWiseContent = await Content.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "users",
                    },
                },
                {
                    $unwind: {
                        path: "$users",
                    },
                },
                {
                    $addFields: {
                        contentAddedAt: {
                            $dateToParts: {
                                date: "$createdAt",
                            },
                        },
                    },
                },
                {
                    $match: {
                        "contentAddedAt.year": Number(year),
                    },
                },
                {
                    $group: {
                        _id: "$contentAddedAt.month",
                        count: { $count: {} },
                    },
                },
            ]
            );

            // const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            const month = ["jan","feb","mar","apr","may","june","july","august","sep","oct","nov","dec"]
            const mappedArr = month.map((data,index) => {
                const i = yearWiseContent.findIndex((val)=>val._id===index+1);
                   return {month:data,count:yearWiseContent[i]?.count ?? 0}
            })
            return (mappedArr)
        } catch (error) {
            throw (error)
        }
    }
}
// if(yearWiseContent[0]._id === data){
//     return {month:data,count:yearWiseContent[0].count}
// }else{
//     return {month:data,count:0}
// }

// if (yearWiseContent.includes(data)) {
//     return { month: data, count: yearWiseContent[0].count }
// }else{
//     return {month:data,count:0}
// }