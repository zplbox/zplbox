package io.github.meixxi.zplbox.service.render;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class HtmlRenderServiceImpl implements HtmlRenderService {

    private static final Logger log = LoggerFactory.getLogger(HtmlRenderServiceImpl.class);

    @Override
    public BufferedImage render(URI sourceUri, int widthPts, int heightPts) throws Exception {

        // create temp file
        Path pathRenderedPng = Files.createTempFile("html2zpl-" + UUID.randomUUID(), ".png");

        // construct chromium rendering command
        String[] command = new String[]{
                "chromium",
                "--headless",
                "--disable-gpu",
                "--no-sandbox",
                "--virtual-time-budget=10000",
                "--run-all-compositor-stages-before-draw",
                "--hide-scrollbars",
                "--disable-software-rasterizer",
                String.format("--window-size=%d,%d", widthPts, heightPts),
                String.format("--screenshot=%s", pathRenderedPng),
                sourceUri.toString()
        } ;

        BufferedImage bufferedImage;

        try {
            // execute command
            executeCommand(command);

            // cache image
            bufferedImage = ImageIO.read(pathRenderedPng.toFile());

        } catch (Exception ex) {
            throw new Exception();

        } finally {
            // clean up
            Files.delete(pathRenderedPng);
        }

        // return rendered image
        return bufferedImage;
    }

    /**
     * Helper method to execute chromium as process.
     */
    private void executeCommand(String[] command) throws Exception {
        ProcessBuilder processBuilder = new ProcessBuilder(command);
        Process process = processBuilder.start();

        // read stdout
        BufferedReader stdOut = new BufferedReader(new InputStreamReader(process.getInputStream()));

        String line;
        while ((line = stdOut.readLine()) != null) {
            log.info("Chromium: {}", line);
        }

        // stderr
        BufferedReader stdErr = new BufferedReader(new InputStreamReader(process.getErrorStream()));
        String errorLine;
        while ((errorLine = stdErr.readLine()) != null) {
            log.warn("Chromium: {}", errorLine);
        }

        int exitCode = process.waitFor();
        log.info("Chromium: Process exited with code: {}", exitCode);
    }
}
