export const domain="http://splitup.ignorelist.com:8001"
export const expenseCategories = ["Food", "Transport", "Entertainment", "Utilities", "Healthcare", "Shopping", "Education", "Others"];
export const Appname="SplitUp"

const thisuserid = JSON.parse(sessionStorage.getItem("user_data"));
export const APIauth = ({req}) => { return ({
    method: req,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${thisuserid.access}`,
    },
})}

export const APIauthPost = ({payload}) => {
    return({
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${thisuserid.access}`,
            "body": JSON.stringify(payload)
        }
    })
}
