const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
require('dotenv').config();

let paperTitle = [];
let keywordCount = [];

const sleep = ms => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};

const replaceAll = (srcStr, searchStr, replaceStr) => {
    return srcStr.split(searchStr).join(replaceStr);
};

const getHtml = async (page_number, search_string, start_year) => {
    try {
        const start_count = (Number(page_number) - 1) * 10;
        const parsing_string = replaceAll(search_string, ' ', '+');

        const config = {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36',
            },
        };
        let url = `https://scholar.google.com/scholar?start=${start_count}&q=${parsing_string}`;
        if (start_year !== 0) url += `&as_ylo=${start_year}`;

        return await axios.get(url, config);
    } catch (err) {
        console.error(err);
    }
};

const getPaperTitle = async (search, year) => {
    try {
        for (let i = 1; i <= Number(process.env.END_PAGE); ++i) {
            console.log(i);
            const html = await getHtml(i, search, year);

            const $ = cheerio.load(html.data);
            const $bodylist = $('h3');

            let title_cnt = 0;
            $bodylist.each(function(idx, elem) {
                paperTitle.push(
                    $(this)
                        .find('a')
                        .text(),
                );
                title_cnt++;
            });
            //끝 페이지 판단
            if (title_cnt === 0) {
                console.log('end page');
                return;
            }
            await sleep(5000); //5seconds sleep
        }
    } catch (err) {
        console.error(err);
    }
};

const wordCount = () => {
    paperTitle.forEach(title => {
        title.split(' ').forEach(keyword => {
            const isExist = keywordCount.find((elem, idx) => {
                return elem.keyword === keyword;
            });
            if (isExist === undefined) {
                keywordCount.push({ keyword: keyword, count: 1 });
            } else {
                isExist.count++;
            }
        });
    });
};

const runApp = async () => {
    await getPaperTitle(process.env.SEARCH, process.env.START_YEAR);
    wordCount();

    keywordCount.sort((a, b) => {
        return b.count - a.count;
    });

    keywordCount.forEach(elem => {
        console.log(elem);
        fs.appendFileSync(
            `./${process.env.SEARCH} result(${Date.now()}).txt`,
            `${elem.keyword},${elem.count}\n`,
            'utf8',
        );
    });
};

runApp();
