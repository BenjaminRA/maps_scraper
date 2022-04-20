import fetch from 'node-fetch';
import prompt from 'prompt-sync'

// const place = 'High Line' // 25 hours
// const place = 'Statue of Liberty National Monument, Nueva York, EE. UU.' // 2 hours
const place = prompt()('Enter a place: ')
const language = prompt()('Enter a language in a format listed by google (https://sites.google.com/site/tomihasa/google-language-codes): ')
const URL = `https://www.google.cl/search?q=${place}&tbm=map&hl=${language}`

const get_avg_time_spent = (avg_time_spent) => {
    if (avg_time_spent == null) return null

    const text = avg_time_spent[0].split('People typically spend up to ')[1]
    const number = text.split(' ')[0]
    if (text.includes('min')) {
        return parseInt(number)
    }

    if (text.includes('hour')) {
        return parseInt(number) * 60
    }

    return null
}

const main = async () => {
    try {
        const response = await fetch(URL, {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Cookie': '1P_JAR=2022-04-18-00; AEC=AakniGMPrXSru5jrixq1vkbR1kj6vxLxTsvoAWdZpXRSHHhEtlSUMvCuRQ; NID=511=AcMEChtrAah9QQ6KZ-VOOFhsmkwuzmknM3BUlge-p18uEfa14TmJubIn4lB4DLRu5Z-kHc_6TFV3gHepzzDrJSLJQSYGoY09WWyqWfrg7fE1t_ScmMleezCwE2u01GtuKYJJOMX6uRdY5sAQxb6A4FulvaMuk5daxpLF9G1OVqQ'
            }
        })

        const body = await response.text()
        const result = JSON.parse(body.substring(5))

        const place = {
            name: result[0][1][0][14][18],
            address: result[0][1][0][14][2],
            rating: result[0][1][0][14][4][7],
            description: {
                short: result[0][1][0][14][32][0][1],
                long: result[0][1][0][14][32][1][1]
            },
            coordinates: {
                lat: result[0][1][0][14][9][2],
                lng: result[0][1][0][14][9][3]
            },
            reviews: {
                count: result[0][1][0][14][4][8],
                reviews: result[0][1][0][14][31] ? result[0][1][0][14][31][1] : []
            },
            categories: result[0][1][0][14][76].map(category => category[0]),
            avg_time_spent: get_avg_time_spent(result[0][1][0][14][117])
        }
        console.log(place)
    } catch (error) {
        console.log('Not found')
    }


}

main()

// https://lh5.googleusercontent.com/p/AF1QipNJzIOJjrqQY0vl9OieB8K1VWRsMJOvN-_Q4psZ=w60-h80-n-k-no -> https://lh5.googleusercontent.com/p/AF1QipNJzIOJjrqQY0vl9OieB8K1VWRsMJOvN-_Q4psZ=s4096-k-no
// se configura el tamaño de la imagen con el parametro s4096-k-no, donde el numero despues de s correponde al factor de escalado