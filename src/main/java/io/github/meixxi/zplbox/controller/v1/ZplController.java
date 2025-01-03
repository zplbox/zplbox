package io.github.meixxi.zplbox.controller.v1;

import io.github.meixxi.zplbox.controller.util.Responses;
import io.github.meixxi.zplbox.service.print.PrintService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

import static org.springframework.http.MediaType.*;

@RestController
@RequestMapping("/v1/zpl")
public class ZplController {

    private static final Logger log = LoggerFactory.getLogger(ZplController.class);

    @Autowired
    private PrintService printService;

    @PostMapping(value = "/print/{tcpAddress}", consumes = TEXT_PLAIN_VALUE, produces = {APPLICATION_PROBLEM_JSON_VALUE})
    public ResponseEntity<?> printLabel(@PathVariable String tcpAddress, @RequestBody String zplData, HttpServletRequest httpServletRequest) {
        try {
            URI uri = new URI("tcp://" + tcpAddress);
            printService.printLabel(zplData, uri.getHost(), uri.getPort());
            return Responses.createOkResponse();

        } catch (Exception ex) {
            log.error("Error printing label.", ex);
            return Responses.createBadRequestResponse(httpServletRequest, ex);
        }
    }
}
