import io.github.cdimascio.dotenv.Dotenv;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class TelegramProxy {
    public static void main(String[] args) {
        try {
            // 1. LOAD THE HIDDEN ENVIRONMENTAL VARIABLES
            Dotenv dotenv = Dotenv.load();
            String botToken = dotenv.get("TELEGRAM_BOT_TOKEN");
            String chatId = dotenv.get("TELEGRAM_CHAT_ID");

            // 2. PREPARE THE MESSAGE TEXT
            String messageText = "New submission received by proxy!";
            String encodedMessage = URLEncoder.encode(messageText, StandardCharsets.UTF_8);

            // 3. BUILD THE SECURE TELEGRAM API URL DYNAMICALLY
            String telegramUrl = "https://telegram.org" + botToken 
                               + "/sendMessage?chat_id=" + chatId 
                               + "&text=" + encodedMessage;

            // 4. SEND THE DIRECT HTTP REQUEST
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(telegramUrl))
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // 5. VERIFY IF IT SENT SUCCESSFULLY
            if (response.statusCode() == 200) {
                System.out.println("Success! Message routed safely to Telegram.");
            } else {
                System.out.println("Failed to send. Error Code: " + response.statusCode());
                System.out.println("Response details: " + response.body());
            }

        } catch (Exception e) {
            System.out.println("An error occurred while routing data: " + e.getMessage());
        }
    }
}
