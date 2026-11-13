import type { EvaluationReport } from './api';

// Clearly synthetic content used only to preview the report interface.
export const SAMPLE_REPORT: EvaluationReport = {
  id: 'sample-evaluation-001',
  ingestionId: 'sample-ingestion-001',
  repositoryUrl: 'https://github.com/campuscode-demo/spring-boot-ecommerce',
  overallScore: 84,
  summary: 'This sample project shows clear service boundaries and meaningful test coverage. The evidence also points to opportunities to strengthen authentication checks and improve recovery behavior around external payment requests.',
  createdAt: '2026-11-12T10:00:00.000Z',
  completedAt: '2026-11-12T10:04:12.000Z',
  dimensions: [
    {
      dimension: 'architecture', score: 4,
      rationale: 'Controllers delegate business operations to focused services, making the main request flow relatively easy to follow. A small dependency cycle appears between order and inventory responsibilities.',
      citations: [{ evidenceId: 'sample-e1', filePath: 'src/main/java/orders/OrderController.java', startLine: 18, endLine: 24, excerpt: '@PostMapping("/checkout")\npublic ResponseEntity<OrderResponse> checkout(@Valid @RequestBody CartRequest request) {\n    return ResponseEntity.ok(orderService.checkout(request.cartId()));\n}' }],
    },
    {
      dimension: 'maintainability', score: 4,
      rationale: 'The code uses clear package boundaries and named domain operations. Configuration is separated from request handling, though a few service methods combine orchestration and persistence work.',
      citations: [{ evidenceId: 'sample-e2', filePath: 'src/main/java/orders/OrderService.java', startLine: 31, endLine: 38, excerpt: 'public OrderResponse checkout(UUID cartId) {\n    Cart cart = cartRepository.findById(cartId).orElseThrow();\n    return reserveInventoryAndCreateOrder(cart);\n}' }],
    },
    {
      dimension: 'testing', score: 3,
      rationale: 'Repository evidence includes integration coverage for checkout behavior. The available sample does not show equivalent coverage for payment retry edge cases.',
      citations: [{ evidenceId: 'sample-e3', filePath: 'src/test/java/orders/CheckoutServiceTest.java', startLine: 42, endLine: 49, excerpt: '@Test\nvoid checkoutReservesInventoryForValidCart() {\n    var result = checkoutService.checkout(cart.id());\n    assertThat(result.status()).isEqualTo(OrderStatus.CONFIRMED);\n}' }],
    },
    {
      dimension: 'reliability', score: 4,
      rationale: 'The checkout path applies a bounded lock wait and returns an explicit failure when inventory cannot be reserved. More evidence would be needed to assess broader timeout and recovery behavior.',
      citations: [{ evidenceId: 'sample-e4', filePath: 'src/main/java/inventory/InventoryService.java', startLine: 55, endLine: 61, excerpt: 'if (!lock.tryLock(5, TimeUnit.SECONDS)) {\n    throw new InventoryUnavailableException("Could not reserve inventory");\n}\ntry {\n    return reserveItems(cart);' }],
    },
    {
      dimension: 'security', score: 3,
      rationale: 'Request validation is visible in the API layer, but this sample contains limited evidence for authorization rules and secret handling. Treat the score as an evidence gap to review.',
      citations: [{ evidenceId: 'sample-e5', filePath: 'src/main/java/security/SecurityConfig.java', startLine: 27, endLine: 33, excerpt: 'http.authorizeHttpRequests(auth -> auth\n    .requestMatchers("/health").permitAll()\n    .requestMatchers("/api/**").authenticated()\n);' }],
    },
    {
      dimension: 'performance/scalability', score: 3,
      rationale: 'A bounded database connection pool and targeted inventory lookup are present. The returned sample evidence is not sufficient to judge behavior under sustained load.',
      citations: [{ evidenceId: 'sample-e6', filePath: 'src/main/resources/application.yml', startLine: 14, endLine: 18, excerpt: 'spring:\n  datasource:\n    hikari:\n      maximum-pool-size: 20\n      connection-timeout: 3000' }],
    },
  ],
};
