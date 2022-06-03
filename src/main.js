// Dom selector

var pageNumbers = document.querySelector("#pageNumber")
var currentPageNumbers = document.querySelector("#currentPage")
var viewer = document.querySelector("#viewer")
var nextPage = document.querySelector("#p_n")
var prevPage = document.querySelector("#p_p")


// Global variable
var totalPages;
var currentPage = 1

// initial rendering
renderPage(currentPage)
currentPageNumbers.textContent = currentPage

// On next page request
nextPage.onclick = () => {
    currentPage = currentPage + 1
    renderPage(currentPage)
    currentPageNumbers.textContent = currentPage
}



// On previous page request
prevPage.onclick = () => {
    currentPage = currentPage - 1
    renderPage(currentPage)
    currentPageNumbers.textContent = currentPage
}


// Main render asynchronous function 
function renderPage(currentPage) {

    var loadingTask = pdfjsLib.getDocument('test.pdf');
    loadingTask.promise.then(function (pdf) {

        totalPages = pdf._pdfInfo.numPages;

        if (totalPages != 0) {
            pageNumbers.textContent = totalPages
        }

        pdf.getPage(currentPage).then(function (page) {
            var scale = 1;
            var viewport = page.getViewport({
                scale: scale,
            });
            // Support HiDPI-screens.
            var outputScale = window.devicePixelRatio || 1;

            var canvas = viewer;
            var context = canvas.getContext('2d');

            canvas.width = Math.floor(viewport.width * outputScale);
            canvas.height = Math.floor(viewport.height * outputScale);
            canvas.style.width = Math.floor(viewport.width) + "px";
            canvas.style.height = Math.floor(viewport.height) + "px";

            var transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] :
                null;

            var renderContext = {
                canvasContext: context,
                transform: transform,
                viewport: viewport
            };
            page.render(renderContext);
        });

    });



}

function numberCheck(num) {
    if (num % 2 == 0) {
        return true;
    } else {
        return false;
    }
}





/** 
 * Suppose there is a book with total page of 11
 * So, the PrintBook will take 6 Paper sheets
 * 
 * Now if you want to print the book in 1 Juzz(খন্ড)
 * then the range will be 1-11,
 * if you wanto to print the book in 2 Juss(খন্ড)
 * then the range will be (1-5)(3 page), (6-11)(3 page)
 * 
 * 
 * So, the params. are -  totalPage, printSegment, ranges[array], sheet
 * 
 * 
 * The printed segment should be flipped around the longest edege
 */

// Printable book calculation asynchronous function 
function bookLet(src, segment = 1) {

    var loadingTask = pdfjsLib.getDocument(src);

    var output =[]

    loadingTask.promise.then(function (pdf) {
        let totalPage = pdf._pdfInfo.numPages;
        // let totalPage = 97;
        let sheet = Math.ceil(totalPage / 2);
        let segments = segment




        let pageOrder = []
        //[1,2,3,4,5,6,7,8,9,10,11,12]
        let reOrder = []
        let even = []
        let odd = []


        //[12,11,10,9,8,7,6,5,4,3,2,1]
        // Split the array in two half
        // Sequence join 
        // [12,10,8,2,4,6] + [1,3,5,11,9,7]
        // Flip log edge
        // [2,4,6]+[11,9,7]
        // [ (12,1), (10,3) , (8, 5) -- flip operation -- (2,11) , (4,9) , (6,7)  ]

        for (let i = 1; i <= totalPage + 1; i++) {
            pageOrder.push(i)
        }

        pageOrder.reverse()

        pageOrder.forEach(i => {
            if (numberCheck(i)) {
                even.push(i)
            } else {
                odd.push(i)
            }
        })

        // REversing the odd array to match
        odd.reverse()

        for (let i = 0; i <= even.length - 1; i++) {
            reOrder.push([
                even[i],
                odd[i]
            ])
        }

        // console.log(reOrder);

        let final = []
        let seg1 = []
        let seg2 = []

            for (let i = 0; i < reOrder.length; i++) {
                if (i < reOrder.length / 2) {
                    seg1.push(reOrder[i])
                } else {
                    seg2.push(reOrder[i])
                }
            }

            seg1.forEach(element => {
                if (element) {
                    final.push(element)
                }
            });


            final.push([0, 0])
            seg2.reverse()

            for (let i = seg2.length - 1; i >= 0; i--) {
                final.push(seg2[i])
            }

            console.log(final)
           
    })
}

bookLet("test.pdf")