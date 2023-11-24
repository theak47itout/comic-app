import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useRef } from "react";
import Spinner from "react-bootstrap/Spinner";
import ShareButtons from "./ShareButtons";
import html2canvas from "html2canvas";
import img from "../assets/bg_img.png";

function ComicStrip() {
  const [searchStrings, setSearchStrings] = useState(Array(10).fill(""));
  const [fetchedImages, setFetchedImages] = useState(Array(10).fill(null));
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef(null);

  const fetchImages = async () => {
    try {
      setIsLoading(true);

      const fetchedImagesPromises = searchStrings.map(
        async (searchString, index) => {
          console.log(searchString);
          // const response =await fetchImage(searchString);
          const response = await fetch(
            "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
            {
              headers: {
                Accept: "image/png",
                Authorization:
                  "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify({ inputs: searchString }),
            }
          );
          if (response.status !== 200) {
            throw new Error(response.status);
          }
          const imageBlob = await response.blob();
          const imageUrl = URL.createObjectURL(imageBlob);

          return imageUrl;
        }
      );
      const fetchedImagesArray = await Promise.all(fetchedImagesPromises);
      console.log("Generated Images:", fetchedImagesArray);
      setFetchedImages(fetchedImagesArray);
    } catch (errorCode) {
      alert(`Unable to process your request. ${errorCode}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadImages = async () => {
    try {
      setIsDownloading(true);
      const canvas = await html2canvas(cardRef.current);
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "comic_strip.png";
      a.click();
    } catch (error) {
      alert(`Unable to process your request. Error: ${error}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="mt-5 max-w-7xl mx-auto">
      {/* <Hero /> */}

      <div
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white bg-center backdrop-blur-md"
        style={{
          backgroundImage: `url(${img})`,
          backgroundRepeat: 'repeat',          
        }}
      >
        <div className="space-y-3">
          <div class="py-6 flex flex-col justify-center sm:py-12">
            <div class="relative py-3 sm:max-w-xl sm:mx-auto">
              {/* <div class="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div> */}
              <div class="relative mx-3 px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 sm:mx-5">
                <div class="w-3xl mx-auto">
                  <div>
                    <h1 class="text-2xl text-center font-semibold">
                      Script your personalized comic strip adventure!
                    </h1>
                  </div>
                  <div class="divide-y divide-gray-200">
                    <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                      <div class="relative">
                        {searchStrings.map((textInput, index) => (
                          <div class="relative m-8">
                            <input
                              autoComplete="off"
                              type="text"
                              class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                              placeholder={`Prompt ${index + 1}`}
                              value={textInput}
                              required
                              onChange={(e) => {
                                const newSearchStrings = [...searchStrings];
                                newSearchStrings[index] = e.target.value;
                                setSearchStrings(newSearchStrings);
                              }}
                            />
                            <label class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                              {`Prompt ${index + 1}`}
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 flex gap-5 justify-center">
                        <button
                          className="text-white bg-blue-500 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:opacity-25"
                          onClick={fetchImages}
                          disabled={isLoading}
                        >
                          {isLoading
                            ? "Hang on tight! Making your comic strip!"
                            : "Generate comic strip!"}
                        </button>
                      </div>
                      <div className="mt-5 flex gap-5 justify-center text-center">
                        {isLoading ? (
                          <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </Spinner>
                        ) : null}
                      </div>
                      {fetchedImages.some((image) => image !== null) && (
                        <div className="mt-5 text-[#666e75] text-[14px] max-w-[500px]">
                          <h2>Generated Images:</h2>
                          <div className="image-row" ref={cardRef}>
                            {fetchedImages.map((image, index) => (
                              <div key={index} className="image-item">
                                <img
                                  src={image}
                                  alt={`Generated ${index + 1}`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="mt-10 flex-col justify-center">
                        <p className="mt-2 text-[#666e75] text-[14px]">
                          After heroically crafting your comic strip
                          masterpiece, it's time to unleash it upon the comic
                          book community! Just tap into your superpowers and
                          click the button below to download and share your epic
                          comic panel.
                        </p>
                        <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                        <div class="sm:flex sm:items-center sm:justify-between">
                          <button
                            // type="submit"
                            className="mt-3 mr-10 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:opacity-25"
                            onClick={handleDownloadImages}
                            disabled={isDownloading}
                          >
                            {isDownloading ? "Downloading" : "Download"}
                          </button>
                          <ShareButtons />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ComicStrip;
