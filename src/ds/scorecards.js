import {uid} from "uid";

export const scorecards = [
    {
        id: 1,
        matchId: 1,
        firstInnings: {
            battingDetails: {
                teamId: 1,
                teamName: "Bangladesh",
                teamCode: "ban",
                teamBatsmen: [
                   {
                        id: 1,
                        order: 1,
                        name: "Mahmudullah Riyadh",
                        nickname: "Mahmudullah",
                        runs: 5,
                        balls: 10,
                        strikeRate: 50,
                        dots: 0,
                        ones: 0,
                        twos: 0,
                        threes: 0,
                        fours: 0,
                        fives: 0,
                        sixes: 0,
                        isOut: false,
                        outDetails: "c Ritwik Behera b Vatsal Vaghela",
                        bowlerId: 2,
                        fielderId: 3,
                        wicketCode: "caught"
                    }
                ]
            },
            bowlingDetails: {
                teamId: 2,
                teamName: "India",
                teamCode: "ind",
                teamBowlers: [
                    {
                        id: 2,
                        order: 1,
                        name: "Nisarg Patel",
                        nickname: "",
                        overs: 4,
                        runs: 29,
                        wickets: 2,
                        maidens: 0,
                        economy: 7.2,
                        balls: 40,
                        dotBalls: 0,
                        noBalls: 0,
                        wideBalls: 0
                    },
                ]
            },
            scoreDetails: {
                overs: 18.5,
                runs: 150,
                wickets: 10
            },
            extras: {
                total: 6,
                wideBalls: 5,
                noBalls: 0,
                byes: 0,
                legByes: 1,
                penalty: 0
            },
            wickets: [
                {
                    batsmanId: 1,
                    batsmanName: "Simi Singh",
                    batsmanNickname: "Simi",
                    wicketNumber: 1,
                    wicketOver: 16.5,
                    wicketRuns: 128
                },
                {
                    batsmanId: 2,
                    batsmanName: "Simi SS",
                    batsmanNickname: "Simis",
                    wicketNumber: 2,
                    wicketOver: 17.5,
                    wicketRuns: 132
                }
            ],
            partnerships: [
                {
                    id: uid(),
                    runs: 6,
                    balls: 6,
                    bat1Id: 1,
                    bat1Name: "Stirling",
                    bat1Nickname: "Stirling",
                    bat1Runs: 5,
                    bat1balls: 0,
                    bat1fours: 1,
                    bat1sixes: 0,
                    bat2Id: 2,
                    bat2Name: "Balbirnie",
                    bat2Nickname: "Balbirnie",
                    bat2Runs: 1,
                    bat2balls: 0,
                    bat2fours: 0,
                    bat2sixes: 0,
                }
            ]
        },
        secondInnings: {
            battingDetails: {
                teamId: 1,
                teamName: "Bangladesh",
                teamCode: "ban",
                teamBatsmen: [
                    {
                        id: 1,
                        name: "Mahmudullah Riyadh",
                        nickname: "Mahmudullah",
                        runs: 5,
                        balls: 10,
                        strikeRate: 50,
                        dots: 0,
                        ones: 0,
                        twos: 0,
                        threes: 0,
                        fours: 0,
                        fives: 0,
                        sixes: 0,
                        isOut: false,
                        outDetails: "c Ritwik Behera b Vatsal Vaghela",
                        bowlerId: 2,
                        fielderId: 3,
                        wicketCode: "caught"
                    }
                ]
            },
            bowlingDetails: {
                teamId: 2,
                teamName: "India",
                teamCode: "ind",
                teamBowlers: [
                    {
                        id: 2,
                        name: "Nisarg Patel",
                        nickname: "",
                        overs: 4,
                        runs: 29,
                        wickets: 2,
                        maidens: 0,
                        economy: 7.2,
                        balls: 40,
                        dotBalls: 0,
                        noBalls: 0,
                        wideBalls: 0
                    },
                ]
            },
            scoreDetails: {
                overs: 18.5,
                runs: 150,
                wickets: 10
            },
            extras: {
                total: 6,
                wideBalls: 5,
                noBalls: 0,
                byes: 0,
                legByes: 1,
                penalty: 0
            },
            wickets: [
                {
                    batsmanId: 1,
                    batsmanName: "Simi Singh",
                    batsmanNickname: "Simi",
                    wicketNumber: 1,
                    wicketOver: 16.5,
                    wicketRuns: 128
                },
                {
                    batsmanId: 2,
                    batsmanName: "Simi SS",
                    batsmanNickname: "Simis",
                    wicketNumber: 2,
                    wicketOver: 17.5,
                    wicketRuns: 132
                }
            ],
            partnerships: [
                {
                    id: uid(),
                    runs: 6,
                    balls: 6,
                    bat1Id: 1,
                    bat1Name: "Stirling",
                    bat1Nickname: "Stirling",
                    bat1Runs: 5,
                    bat1balls: 0,
                    bat1fours: 1,
                    bat1sixes: 0,
                    bat2Id: 2,
                    bat2Name: "Balbirnie",
                    bat2Nickname: "Balbirnie",
                    bat2Runs: 1,
                    bat2balls: 0,
                    bat2fours: 0,
                    bat2sixes: 0,
                }
            ]
        },
    },
];