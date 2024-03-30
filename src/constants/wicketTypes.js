export default {
    bowled: 1,
    catch: 2,
    run: 3,
    stumped: 4,
    lbw: 5,
    hit: 6,
    getAll: () => {
        return [
            {value: 1, label: "Bowled Out"},
            {value: 2, label: "Catch Out"},
            {value: 3, label: "Run Out"},
            {value: 4, label: "Stumped Out"},
            {value: 5, label: "LBW Out"},
            {value: 6, label: "Hit Out"}
        ]
    },
    getLabel: (value) => {
        let label = "Bowled Out";
        value = parseInt(value);
        switch (value) {
            case 1:
                label = "Bowled Out";
                break;
            case 2:
                label = "Catch Out";
                break;
            case 3:
                label = "Run Out";
                break;
            case 4:
                label = "Stumped Out";
                break;
            case 5:
                label = "LBW out";
                break;
            case 6:
                label = "Hit Out";
                break;
            default:
                break;
        }

        return label;
    }
}