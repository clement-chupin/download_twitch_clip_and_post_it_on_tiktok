const puppeteer = require('puppeteer')

/**
 * @param {string} facebookLogin
 * @param {string} facebookPassword
 * @param {string} videoPath
 * @param {string} legend
 * @param {boolean} show
 * 
 * @returns {Promise}
 */
function post(facebookLogin, facebookPassword, videoPath, legend, apiFile) {
    return new Promise(async (resolve, rejects) => {
        console.log('Launch !')
        const browser = await puppeteer.launch({
            headless: false,
            args: [
                //'--window-size=800,500',
                //'--disable-gpu',
                //"--incognito",

                "--no-sandbox",
                //"--single-process",
                //"--no-zygote"
                /*'--allow-silent-push',
                //'--disable-device-discovery-notifications',
                '--disable-notifications',
                '--dont-require-litepage-redirect-infobar',
                '--suppress-message-center-popups',*/



                '--window-position=400,400'
            ]
        })
        console.log('Launched')
        let posterTimeout = true
        setTimeout(async () => {
            if (posterTimeout) {
                await browser.close()
                console.log('Timed out')
                post(facebookLogin, facebookPassword, videoPath, legend, true, apiFile)
                rejects('timed out')
            }
        }, 60000)

        console.log('Go to login page')

        
        const context = browser.defaultBrowserContext();
        context.overridePermissions("https://www.tiktok.com/", ["geolocation", "notifications"]);
        const page = await browser.newPage();

        



        await page.goto('https://www.tiktok.com/login')


        var output = await page.evaluate(() => {
            return;
          });

        console.log('Waiting for Fb Login selector...')

        const facebookButtonSelector = '.channel-item-wrapper-2gBWB+.channel-item-wrapper-2gBWB+.channel-item-wrapper-2gBWB .channel-name-2qzLW'
        await page.waitForSelector(facebookButtonSelector)

        console.log('Waited !')
        
        let hasLoggedIn = false
        await browser.on('targetcreated', async () => {
            console.log('Target created')
            /** @type {import('puppeteer').Page} foundFacebookLogin */
            const facebookLoginPage = await findFacebookLogin(browser);
            console.log('Fb login page found ? ' + (facebookLoginPage ? 'yes' : 'no'))
            if (facebookLoginPage) {
                console.log('Fb login page reloading...')
                await facebookLoginPage.reload()
                console.log('Fb login page reloaded. Loggin-in ...')
                try {
                    await facebookLoginPage.evaluate((facebookLogin, facebookPassword) => {
                        const body = document.body
                        body.querySelector('#email').value = facebookLogin
                        body.querySelector('#pass').value = facebookPassword
                        body.querySelector('input[name="login"]').click()
                    }, facebookLogin, facebookPassword)
                } catch (loginError) {
                    await browser.close()
                    rejects('Facebook Login Failed')

                    return
                }
                
                console.log('Likely logged in !')
            } else {
                /** @type {import('puppeteer').Page} loggedInPage */
                const loggedInPage = await findLoggedInPage(browser);
                console.log('TikTok page found ? ' + (loggedInPage ? 'yes' : 'no'))
                if (loggedInPage) {
                    if (! hasLoggedIn) {
                        hasLoggedIn = true
                        posterTimeout = false
                        console.log('Goto upload page...')
                        await page.goto('https://www.tiktok.com/upload/?lang=en')

                        console.log('Went ! Waiting for selector...')
                        const videoInputSelector = 'input[name="upload-btn"]'
                        await page.waitForSelector(videoInputSelector)
                        const inputFile = await page.$(videoInputSelector)
                        console.log('Waited ! Uploading file...')
                        await inputFile.uploadFile(videoPath)
                        
                        console.log('Uploaded ! Waiting for legends input...')
                        const legendInputSelector = '.DraftEditor-editorContainer>div'
                        await page.waitForSelector(legendInputSelector)
                        console.log('Waited ! focusing input...')
                        await page.evaluate((legendInputSelector) => {
                            document.body.querySelector(legendInputSelector).focus()
                        }, legendInputSelector)

                        console.log('Focused ! Typing legend...')
                        await asyncForEach(Array.from(legend), async (char) => {
                            await sleep(100)
                            await page.type(legendInputSelector, char)
                        })

                        await page.type(legendInputSelector, ' ')
                        console.log('Typed !')

                        setTimeout(async () => {
                            console.log('Waiting for post button...')
                            const postButtonSelector = 'button[type="button"]:nth-of-type(2)'
                            await page.waitForSelector(postButtonSelector)
                            console.log('Waited ! Clicking post button...')
                            
                            await page.click(postButtonSelector)
                            console.log('Clicked !')
                            setTimeout(async () => {
                                let pages = await browser.pages();
                                await Promise.all(pages.map(page =>page.close()));
                                await browser.close();
                                console.log('Likely Posted !')
                                setTimeout(apiFile.deleteClip.bind(null,videoPath),2000);
                                resolve()
                            }, 3000)
                        }, 3000)
                    }
                }
            }
        })
        //setTimeout(,2000);
        await page.click(facebookButtonSelector)
    })
}

/**
 * @param {import('puppeteer').Browser} browser 
 * 
 * @returns {?import('puppeteer').Page}
 */
async function findFacebookLogin(browser) {
    return await findPageIncludes(browser, 'facebook.com/login.php')
}

/**
 * @param {import('puppeteer').Browser} browser 
 * 
 * @returns {?import('puppeteer').Page}
 */
async function findLoggedInPage(browser) {
    return await findPageIncludes(
        browser,
        'https://www.tiktok.com/foryou?loginType=facebook&lang=en'
    ) || await findPageIncludes(
        browser,
        'https://www.tiktok.com/foryou?lang=en'
        
    )
}

/**
 * @param {import('puppeteer').Browser} browser 
 * @param {string} pageTitleIncludedText
 * 
 * @returns {?import('puppeteer').Page}
 */
async function findPageIncludes(browser, pageTitleIncludedText) {
    let pages = await browser.pages()
    for (let i = 0; i < pages.length; i += 1) {
        if (pages[i].url().includes(pageTitleIncludedText)) {
            module.exports.page = pages[i] // Set the new working page as the popup
            return pages[i]
        }
    }
    return null;
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

/**
 * @param {number} ms 
 */
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

module.exports = {post, ok : function(){return "okay"}}