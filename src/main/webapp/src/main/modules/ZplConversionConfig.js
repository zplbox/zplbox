import { useEffect, useState } from "react";

function ZplConversionConfig({ endpointBase, payload, onEndpointBaseUpdate, onConfigUpdate }) {

    // common config
    const [orientation, setOrientation] = useState(undefined);


    // html2zpl config
    const [widthInches, setWidthInches] = useState(undefined);
    const [heightInches, setHeightInches] = useState(undefined);
    const [resolutionDpi, setResolutionDpi] = useState(undefined);


    const [widthPts, setWidthPts] = useState(undefined);
    const [heightPts, setHeightPts] = useState(undefined);

    const resetHtmlConfig = () => {
        setWidthInches(4);
        setHeightInches(6);
        setResolutionDpi(203);
        setOrientation("Rotate0");
        onConfigUpdate({ widthPts: 4 * 203, heightPts: 6 * 203 });
    }

    useEffect(() => {
        if (widthInches === undefined || heightInches === undefined || resolutionDpi === undefined) {
            return;
        }

        setWidthPts(widthInches * resolutionDpi);
        setHeightPts(heightInches * resolutionDpi);

    }, [widthInches, heightInches, resolutionDpi]);

    useEffect(() => {
        if (endpointBase === "html2zpl") {
            if (widthPts === undefined || heightPts === undefined) {
                onConfigUpdate({ widthPts: undefined, heightPts: undefined });
                return;
            }
            onConfigUpdate({ widthPts: widthPts, heightPts: heightPts, orientation: orientation });
        }
    }, [widthPts, heightPts, orientation])


    // pdf2zpl config
    const [dotsPerInch, setDotsPerInch] = useState(undefined);

    const resetPdfConfig = () => {
        setDotsPerInch(203);
        onConfigUpdate({ dotsPerInch: 203 });
        setOrientation("Rotate0");
    }

    useEffect(() => {
        if (endpointBase === "pdf2zpl") {
            onConfigUpdate({ dotsPerInch: dotsPerInch, orientation: orientation });
        }
    }, [dotsPerInch, orientation])


    // endpoint base configuration
    useEffect(() => {

        // reset settings
        if (endpointBase === "html2zpl") {
            resetHtmlConfig();
        } else if (endpointBase === "pdf2zpl") {
            resetPdfConfig();
        }

    }, [endpointBase])


    // return final output
    return (

        <div className="row mt-2">
            <div className="col-2">Endpoint Base:</div>
            <div className="col-5 border-end">

                {/* endpoint base switch */}
                <div className="container-fluid p-0 mb-3">
                    <div className="form-check form-check-inline me-4">
                        <input className="form-check-input" type="radio" checked={endpointBase === "html2zpl"} onChange={(e) => onEndpointBaseUpdate("html2zpl")} />
                        <label className="form-check-label">/v1/html2zpl <small><i>(Web Content)</i></small></label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" checked={endpointBase === "pdf2zpl"} onChange={(e) => onEndpointBaseUpdate("pdf2zpl")} />
                        <label className="form-check-label">/v1/html2zpl <small><i>(PDF Document)</i></small></label>
                    </div>
                </div>

                {/* html2zpl config */}
                {endpointBase === "html2zpl" &&
                    <div className="container-fluid p-0">
                        <div className="row">
                            <div className="col-3">
                                <small className={widthInches === undefined ? 'text-secondary fst-italic' : ''}>Width (inches):</small>
                                <input type="number" className="form-control" value={widthInches ? widthInches : ""} onChange={(e) => setWidthInches(e.target.value)} disabled={widthInches === undefined} />
                            </div>
                            <div className="col-3">
                                <small className={heightInches === undefined ? 'text-secondary fst-italic' : ''}>Height (inches):</small>
                                <input type="number" className="form-control" value={heightInches ? heightInches : ""} onChange={(e) => setHeightInches(e.target.value)} disabled={heightInches === undefined} />
                            </div>
                            <div className="col-3">
                                <small className={resolutionDpi === undefined ? 'text-secondary fst-italic' : ''}>Resolution (dpi):</small>
                                <input type="number" className="form-control" value={resolutionDpi ? resolutionDpi : ""} onChange={(e) => setResolutionDpi(e.target.value)} disabled={resolutionDpi === undefined} />
                            </div>
                            <div className="col-3 d-flex">
                                <button type="button" className={`btn btn-link btn-sm align-self-end p-2 ${!widthInches || !heightInches || !resolutionDpi ? '' : 'd-none'}`} onClick={resetHtmlConfig}>reset sizes</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <small>Width (points):</small>
                                <input type="number" className="form-control" value={widthPts ? widthPts : ""} onChange={(e) => { setWidthPts(e.target.value === '' ? undefined : Number(e.target.value)); setWidthInches(undefined); setHeightInches(undefined); setResolutionDpi(undefined); }} />
                            </div>
                            <div className="col-3">
                                <small>Height (points):</small>
                                <input type="number" className="form-control" value={heightPts ? heightPts : ""} onChange={(e) => { setHeightPts(e.target.value === '' ? undefined : Number(e.target.value)); setWidthInches(undefined); setHeightInches(undefined); setResolutionDpi(undefined); }} />
                            </div>
                            <div className="col-6">
                                <small>Orientation:</small>
                                <select className="form-select" value={orientation} onChange={e => setOrientation(e.target.value)}>
                                    <option value="Rotate0">Rotate0</option>
                                    <option value="Rotate90">Rotate90</option>
                                    <option value="Rotate180">Rotate180</option>
                                    <option value="Rotate270">Rotate270</option>
                                </select>
                            </div>
                        </div>
                    </div>
                }

                {endpointBase === "pdf2zpl" &&
                    <div className="container-fluid p-0">
                        <div className="row">
                            <div className="col-3">
                                <small>Resolution (dpi):</small>
                                <input type="number" className="form-control" value={dotsPerInch ? dotsPerInch : ""} onChange={(e) => setDotsPerInch(e.target.value === '' ? undefined : Number(e.target.value))} />
                            </div>
                            <div className="col-6">
                                <small>Orientation:</small>
                                <select className="form-select" value={orientation} onChange={e => setOrientation(e.target.value)}>
                                    <option value="Rotate0">Rotate0</option>
                                    <option value="Rotate90">Rotate90</option>
                                    <option value="Rotate180">Rotate180</option>
                                    <option value="Rotate270">Rotate270</option>
                                </select>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className="col-5 ps-4">
                <small><i>Request JSON Payload:</i></small>
                <textarea className="form-control form-control-sm font-monospace bg-body-tertiary mb-2" wrap="off" rows={6} value={payload === undefined ? "" : JSON.stringify(payload, null, 2)} readOnly={true} style={{ resize: 'none' }} />
            </div>
        </div>

    )
}

export default ZplConversionConfig;